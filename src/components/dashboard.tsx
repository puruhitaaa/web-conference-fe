import { useQueries } from "@tanstack/react-query";
import api from "@/lib/axios-config";
import { loaRoutes, invoiceRoutes, paymentRoutes } from "@/api";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/auth/authStore";

type LoaHistoryItem = {
  id: string;
  paper_id: string;
  author_names: string;
  tempat_tanggal: string;
  status: string;
};

type InvoiceHistoryItem = {
  id: string;
  invoiceNumber: string;
  authorName: string;
  paperId: string;
  paperTitle: string;
  placeAndDate: string;
  status: string;
};

type ReceiptHistoryItem = {
  id: string;
  invoiceNumber: string;
  receivedFrom: string;
  amount: number;
  paymentDate: string;
  placeAndDate: string;
  status: string;
};

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const results = useQueries({
    queries: [
      {
        queryKey: ["icodsa-loa-history"],
        queryFn: async () => {
          const response = await api.get(loaRoutes.listICODSA);

          console.log("ICODSA LOA response:", response.data);

          return response.data.slice(0, 10).map((item: any) => ({
            id: item.id,
            paper_id: item.paper_id,
            paper_title: item.paper_title,
            author_names: item.author_names,
            status: item.status,
            tempat_tanggal: item.tempat_tanggal,
            signature_id: item.signature_id,
          }));
        },
        enabled: user?.role === 1 || user?.role === 2,
      },
      {
        queryKey: ["icodsa-invoice-history"],
        queryFn: async () => {
          const response = await api.get(invoiceRoutes.listICODSA);
          return response.data.slice(0, 10).map((item: any) => ({
            id: item.id,
            invoiceNumber: item.invoiceNumber,
            authorName: item.authorName,
            paperId: item.paperId,
            paperTitle: item.paperTitle,
            placeAndDate: item.placeAndDate,
            status: item.status || "pending",
          }));
        },
        enabled: user?.role === 1 || user?.role === 2,
      },
      {
        queryKey: ["icodsa-receipt-history"],
        queryFn: async () => {
          const response = await api.get(paymentRoutes.listICODSA);
          return response.data.slice(0, 10).map((item: any) => ({
            id: item.id,
            invoiceNumber: item.invoiceNumber,
            receivedFrom: item.receivedFrom,
            amount: item.amount,
            paymentDate: item.paymentDate,
            placeAndDate: item.placeAndDate,
            status: item.status || "pending",
          }));
        },
        enabled: user?.role === 1 || user?.role === 2,
      },
      {
        queryKey: ["icicyta-loa-history"],
        queryFn: async () => {
          const response = await api.get(loaRoutes.listICICYTA);
          return response.data
            .filter((item: any) => item.conferenceType === "ICICYTA")
            .slice(0, 10)
            .map((item: any) => ({
              id: item.id,
              paper_id: item.paper_id,
              author_names: item.author_names,
              tempat_tanggal: item.tempat_tanggal,
              status: item.status,
            }));
        },
        enabled: user?.role === 1 || user?.role === 3,
      },
      {
        queryKey: ["icicyta-invoice-history"],
        queryFn: async () => {
          const response = await api.get(invoiceRoutes.listICICYTA);
          return response.data
            .filter((item: any) => item.conferenceType === "ICICYTA")
            .slice(0, 10)
            .map((item: any) => ({
              id: item.id,
              invoiceNumber: item.invoiceNumber,
              authorName: item.authorName,
              paperId: item.paperId,
              paperTitle: item.paperTitle,
              placeAndDate: item.placeAndDate,
              status: item.status || "pending",
            }));
        },

        enabled: user?.role === 1 || user?.role === 3,
      },
      {
        queryKey: ["icicyta-receipt-history"],
        queryFn: async () => {
          const response = await api.get(paymentRoutes.listICICYTA);
          return response.data
            .filter((item: any) => item.conferenceTitle === "ICICYTA")
            .slice(0, 10)
            .map((item: any) => ({
              id: item.id,
              invoiceNumber: item.invoiceNumber,
              receivedFrom: item.receivedFrom,
              amount: item.amount,
              paymentDate: item.paymentDate,
              placeAndDate: item.placeAndDate,
              status: item.status || "pending",
            }));
        },
        enabled: user?.role === 1 || user?.role === 3,
      },
    ],
  });

  const [
    icodsaLoaHistory,
    icodsaInvoiceHistory,
    icodsaReceiptHistory,
    icicytaLoaHistory,
    icicytaInvoiceHistory,
    icicytaReceiptHistory,
  ] = results;

  const renderStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "paid":
      case "uploaded":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
      case "not available":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "late":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderLoaHistoryCard = (
    title: string,
    data: LoaHistoryItem[],
    isLoading: boolean,
    error: any,
    viewMoreLink: string
  ) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Error loading data
            </div>
          ) : (
            <ul className="space-y-2">
              {data.length ? (
                data.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span>
                      {item.paper_id} - {item.author_names} -{" "}
                      {item.tempat_tanggal}
                    </span>
                    <div className="flex items-center">
                      {renderStatusIcon(item.status)}
                      <span
                        className={`ml-2 ${
                          item.status?.toLowerCase() === "accepted"
                            ? "text-green-600"
                            : item.status?.toLowerCase() === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {item.status?.charAt(0).toUpperCase() +
                          item.status?.slice(1)}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No history yet
                </p>
              )}
            </ul>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" asChild>
            <Link to={viewMoreLink}>View more</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderInvoiceHistoryCard = (
    title: string,
    data: InvoiceHistoryItem[],
    isLoading: boolean,
    error: any,
    viewMoreLink: string
  ) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Error loading data
            </div>
          ) : (
            <ul className="space-y-2">
              {data.length ? (
                data.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span>
                      {item.invoiceNumber} - {item.authorName} -{" "}
                      {item.placeAndDate}
                    </span>
                    <div className="flex items-center">
                      {renderStatusIcon(item.status)}
                      <span
                        className={`ml-2 ${
                          item.status?.toLowerCase() === "paid"
                            ? "text-green-600"
                            : item.status?.toLowerCase() === "not available"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {item.status?.charAt(0).toUpperCase() +
                          item.status?.slice(1)}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No history yet
                </p>
              )}
            </ul>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" asChild>
            <Link to={viewMoreLink}>View more</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderReceiptHistoryCard = (
    title: string,
    data: ReceiptHistoryItem[],
    isLoading: boolean,
    error: any,
    viewMoreLink: string
  ) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Error loading data
            </div>
          ) : (
            <ul className="space-y-2">
              {data.length ? (
                data.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span>
                      {item.invoiceNumber} - {item.receivedFrom} -{" "}
                      {item.paymentDate}
                    </span>
                    <div className="flex items-center">
                      {renderStatusIcon(item.status)}
                      <span
                        className={`ml-2 ${
                          item.status?.toLowerCase() === "uploaded"
                            ? "text-green-600"
                            : item.status?.toLowerCase() === "not available"
                              ? "text-red-600"
                              : item.status?.toLowerCase() === "pending"
                                ? "text-yellow-600"
                                : item.status?.toLowerCase() === "late"
                                  ? "text-orange-600"
                                  : "text-gray-600"
                        }`}
                      >
                        {item.status?.charAt(0).toUpperCase() +
                          item.status?.slice(1)}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No history yet
                </p>
              )}
            </ul>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" asChild>
            <Link to={viewMoreLink}>View more</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-2">Welcome</h1>
      <p className="text-gray-600 mb-8">to Dashboard</p>

      {user?.role === 1 || user?.role === 2 ? (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">ICODSA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderLoaHistoryCard(
              "History LoA",
              icodsaLoaHistory.data,
              icodsaLoaHistory.isLoading,
              icodsaLoaHistory.error,
              "/icodsa/loa"
            )}
            {renderInvoiceHistoryCard(
              "History Invoice",
              icodsaInvoiceHistory.data,
              icodsaInvoiceHistory.isLoading,
              icodsaInvoiceHistory.error,
              "/icodsa/invoice"
            )}
            {renderReceiptHistoryCard(
              "History Receipt",
              icodsaReceiptHistory.data,
              icodsaReceiptHistory.isLoading,
              icodsaReceiptHistory.error,
              "/icodsa/receipt"
            )}
          </div>
        </div>
      ) : null}

      {user?.role === 1 || user?.role === 3 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">ICICYTA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderLoaHistoryCard(
              "History LoA",
              icicytaLoaHistory.data,
              icicytaLoaHistory.isLoading,
              icicytaLoaHistory.error,
              "/icicyta/loa"
            )}
            {renderInvoiceHistoryCard(
              "History Invoice",
              icicytaInvoiceHistory.data,
              icicytaInvoiceHistory.isLoading,
              icicytaInvoiceHistory.error,
              "/icicyta/invoice"
            )}
            {renderReceiptHistoryCard(
              "History Receipt",
              icicytaReceiptHistory.data,
              icicytaReceiptHistory.isLoading,
              icicytaReceiptHistory.error,
              "/icicyta/receipt"
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
