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
  paper_title: string;
  author_names: string;
  tempat_tanggal: string;
  status: string;
};

type InvoiceHistoryItem = {
  id: string;
  invoice_no: string;
  institution: string;
  status: string;
  created_at: Date;
};

type ReceiptHistoryItem = {
  id: string;
  invoice_no: string;
  paper_title: string;
  received_from: string;
  amount: number;
};

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const results = useQueries({
    queries: [
      {
        queryKey: ["icodsa-loa-history"],
        queryFn: async () => {
          try {
            const response = await api.get(loaRoutes.listICODSA);
            if (!response.data) {
              throw new Error("No data returned from the API");
            }
            return response.data.slice(0, 10).map((item: any) => ({
              paper_id: item.paper_id,
              paper_title: item.paper_title,
              author_names: item.author_names,
              status: item.status,
              tempat_tanggal: item.tempat_tanggal,
              signature_id: item.signature_id,
            }));
          } catch (error) {
            console.error("Error fetching LOA history:", error);
            throw error; // Rethrow to propagate the error to the query
          }
        },
        enabled: user?.role === 2,
      },
      {
        queryKey: ["icodsa-invoice-history"],
        queryFn: async () => {
          try {
            const response = await api.get(invoiceRoutes.listICODSA);
            if (!response.data) {
              throw new Error("No data returned from the API");
            }
            return response.data.slice(0, 10).map((item: any) => ({
              id: item.id,
              invoice_no: item.invoice_no,
              institution: item.institution,
              created_at: new Date(item.created_at),
              status: item.status || "pending",
            }));
          } catch (error) {
            console.error("Error fetching Invoice history", error);
            throw error;
          }
        },
        enabled: user?.role === 2,
      },
      {
        queryKey: ["icodsa-receipt-history"],
        queryFn: async () => {
          try {
            const response = await api.get(paymentRoutes.listICODSA);
            if (!response.data) {
              throw new Error("No data returned from the API");
            }
            return response.data.slice(0, 10).map((item: any) => ({
              id: item.id,
              paper_title: item.paper_title,
              invoice_no: item.invoice_no,
              received_from: item.received_from,
              amount: item.amount,
            }));
          } catch (error) {
            console.error("Error fetching receipt history", error);
            throw error;
          }
        },
        enabled: user?.role === 2,
      },
      {
        queryKey: ["icicyta-loa-history"],
        queryFn: async () => {
          try {
            const response = await api.get(loaRoutes.listICICYTA);
            if (!response.data) {
              throw new Error("No data returned from the api");
            }
            return response.data.slice(0, 10).map((item: any) => ({
              paper_id: item.paper_id,
              paper_title: item.paper_title,
              author_names: item.author_names,
              status: item.status,
              tempat_tanggal: item.tempat_tanggal,
              signature_id: item.signature_id,
            }));
          } catch (error) {
            console.error("Error fetching LOA history:", error);
            throw error;
          }
        },
        enabled: user?.role === 3,
      },

      {
        queryKey: ["icicyta-invoice-history"],
        queryFn: async () => {
          try {
            const response = await api.get(invoiceRoutes.listICICYTA);
            if (!response.data) {
              throw new Error("No data returned from the API");
            }
            return response.data.slice(0, 10).map((item: any) => ({
              id: item.id,
              invoice_no: item.invoice_no,
              institution: item.institution,
              created_at: item.created_at,
              status: item.status || "pending",
            }));
          } catch (error) {
            console.error("Error fetching Invoice history", error);
            throw error;
          }
        },

        enabled: user?.role === 3,
      },
      {
        queryKey: ["icicyta-receipt-history"],
        queryFn: async () => {
          try {
            const response = await api.get(paymentRoutes.listICICYTA);
            if (!response.data) {
              throw new Error("No data returned from the API");
            }
            return response.data.slice(0, 10).map((item: any) => ({
              id: item.id,
              paper_title: item.paper_title,
              invoice_no: item.invoice_no,
              received_from: item.received_from,
              amount: item.amount,
            }));
          } catch (error) {
            console.error("Error fetching receipt history", error);
            throw error;
          }
        },
        enabled: user?.role === 3,
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
                    key={item.id || item.paper_id}
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
                      {item.invoice_no} - {item.institution} -{" "}
                      {new Date(item.created_at).toLocaleDateString()}
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
                      {item.invoice_no} -{" "}
                      {item.paper_title.length > 15
                        ? item.paper_title.slice(0, 15) + "..."
                        : item.paper_title}{" "}
                      - {item.amount}
                    </span>
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

      {user?.role === 2 && (
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
      )}

      {user?.role === 3 && (
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
      )}
    </div>
  );
}
