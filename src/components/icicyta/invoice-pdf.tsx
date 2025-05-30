import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { Invoice } from "./invoice-table";

// Helper function to get year from date

// Helper function to format date as "Bandung, Month Day, Year"
const formatDateForInvoice = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "N/A";
  return `Bandung, ${new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
};

// Helper function to format currency as IDR X.XXX.XXX
const formatCurrencyIDR = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return "N/A";
  return `IDR ${new Intl.NumberFormat("id-ID", {
    style: "decimal", // Using decimal to avoid Rp. prefix if not desired by "IDR" prefix
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)}`;
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 0,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  // Styles for Multi-Invoice Document (InvoicePdfDocument)
  multiInvoiceHeader: {
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  multiInvoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  multiInvoiceSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  multiInvoiceTable: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 20,
    marginHorizontal: 30,
  },
  multiInvoiceTableRow: {
    flexDirection: "row",
  },
  multiInvoiceTableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
  },
  multiInvoiceTableCol: {
    width: "20%", // Adjust if more/less columns or different distributions needed
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
    overflow: "hidden", // Helps prevent text overflow issues
  },
  multiInvoiceTableCell: {
    margin: 2, // Reduced margin for more space
    fontSize: 9, // Slightly smaller for table cells
  },
  multiInvoiceTableHeader: {
    margin: 2,
    fontSize: 9,
    fontWeight: "bold",
  },
  multiInvoiceFooter: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "grey",
    paddingHorizontal: 30,
  },

  // Styles for SingleInvoicePdfDocument (new design based on icodsa)
  Header: {
    backgroundColor: "#9461AF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleHeader: {
    flexDirection: "column",
    gap: 10,
  },
  icodsaTitle: {
    width: 140,
    color: "#ffffff",
  },
  subTitle: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  conferenceNameText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  Title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logoImage: {
    height: 20,
    marginLeft: 8,
  },
  largeLogoImage: {
    height: 60,
    marginLeft: 8,
  },
  mainDocumentTitleSection: {
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  mainDocumentTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  invoiceInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  invoiceToSection: {
    maxWidth: "60%",
  },
  invoiceDateSection: {
    maxWidth: "35%",
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555555",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 9,
    width: "100px",
    color: "#333333",
  },
  detailValue: {
    fontSize: 9,
    flexShrink: 1,
    color: "#333333",
  },
  dateLabel: {
    fontSize: 9,
    width: "80px",
    color: "#333333",
  },
  dateValue: {
    fontSize: 9,
    color: "#333333",
  },
  itemsTable: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: 1,
    marginHorizontal: 30,
  },
  itemsTableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  itemsTableColHeader: {
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  itemsTableCol: {
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    padding: 5,
    justifyContent: "center",
  },
  itemsTableCell: {
    fontSize: 9,
  },
  itemsTableHeader: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  descriptionCol: { width: "50%" },
  quantityCol: { width: "10%" },
  priceCol: { width: "20%" },
  totalCol: { width: "20%", borderRightWidth: 0 },

  itemsTableRowLast: {
    flexDirection: "row",
  },
  subTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 30,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderLeftWidth: 1,
    borderLeftColor: "#000000",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  subTotalLabelCell: {
    width: "80%",
    padding: 5,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "right",
  },
  subTotalValueCell: {
    width: "20%",
    padding: 5,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "right",
  },
  notesSection: {
    marginTop: 20,
    paddingHorizontal: 30,
    fontSize: 9,
    color: "#333333",
    marginBottom: 50, // Space for footer
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notesText: {
    marginBottom: 3,
  },
  notesList: {
    marginTop: 5,
    marginBottom: 10,
  },
  notesListItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  notesListBullet: {
    width: 10,
    fontSize: 9,
  },
  notesListText: {
    flex: 1,
    fontSize: 9,
  },
  paymentDetailRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  paymentDetailLabel: {
    width: "180px",
    fontSize: 9,
  },
  paymentDetailValue: {
    fontSize: 9,
    flexShrink: 1,
  },
  singleInvoicePageFooter: {
    position: "absolute",
    bottom: 40,
    right: 0,
    left: 0,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#9461AF",
    paddingVertical: 12,
  },
  signatureSection: {
    marginTop: 0,
    marginBottom: 20,
    width: 200,
    fontSize: 9,
    alignItems: "center",
    marginLeft: "auto",
  },
  signatureDate: { marginBottom: 10, marginTop: 145 },
  signaturePlaceholderGraphic: {
    width: 120,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#000000",
    marginBottom: 5,
  },
  signatureName: { fontWeight: "bold", fontSize: 10 },
  signatureTitle: { fontSize: 9 },
  signatureIcodsaLogo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#9461AF", // Match header color
    marginBottom: 3,
  },
  pictureUrl: {
    width: 90,
  },
});

// Multiple Invoices PDF Props
interface InvoicePdfProps {
  invoices: Invoice[];
}

// Create Document Component for multiple invoices
export const InvoicePdfDocument: React.FC<InvoicePdfProps> = ({ invoices }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.multiInvoiceHeader}>
        <Text style={styles.multiInvoiceTitle}>ICyTA Invoices</Text>
        <Text style={styles.multiInvoiceSubtitle}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.multiInvoiceTable}>
        <View style={styles.multiInvoiceTableHeaderRow}>
          <View style={styles.multiInvoiceTableCol}>
            <Text style={styles.multiInvoiceTableHeader}>Invoice #</Text>
          </View>
          <View style={styles.multiInvoiceTableCol}>
            <Text style={styles.multiInvoiceTableHeader}>Author Type</Text>
          </View>
          <View style={styles.multiInvoiceTableCol}>
            <Text style={styles.multiInvoiceTableHeader}>LoA ID</Text>
          </View>
          <View style={styles.multiInvoiceTableCol}>
            <Text style={styles.multiInvoiceTableHeader}>
              Presentation Type
            </Text>
          </View>
          <View style={styles.multiInvoiceTableCol}>
            <Text style={styles.multiInvoiceTableHeader}>Total (IDR)</Text>
          </View>
        </View>

        {invoices.map((invoice, i) => (
          <View key={i} style={styles.multiInvoiceTableRow}>
            <View style={styles.multiInvoiceTableCol}>
              <Text style={styles.multiInvoiceTableCell}>
                {invoice.invoice_no || "N/A"}
              </Text>
            </View>
            <View style={styles.multiInvoiceTableCol}>
              <Text style={styles.multiInvoiceTableCell}>
                {invoice.author_type || "N/A"}
              </Text>
            </View>
            <View style={styles.multiInvoiceTableCol}>
              <Text style={styles.multiInvoiceTableCell}>
                {invoice.loa_id || "N/A"}
              </Text>
            </View>
            <View style={styles.multiInvoiceTableCol}>
              <Text style={styles.multiInvoiceTableCell}>
                {invoice.presentation_type || "N/A"}
              </Text>
            </View>
            <View style={styles.multiInvoiceTableCol}>
              <Text style={styles.multiInvoiceTableCell}>
                {formatCurrencyIDR(invoice.amount)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.multiInvoiceFooter}>
        This is an automatically generated document. For more information,
        please contact the conference organizers.
      </Text>
    </Page>
  </Document>
);

// Single Invoice PDF Props
interface SingleInvoicePdfProps {
  invoice: Invoice;
}

// Create Single Invoice Document Component
export const SingleInvoicePdfDocument: React.FC<SingleInvoicePdfProps> = ({
  invoice,
}) => {
  const getInvoiceYear = (date: Date | string | null | undefined): string => {
    if (date) {
      return new Date(date).getFullYear().toString();
    }
    return new Date().getFullYear().toString(); // Fallback to current year
  };

  const getReceiptYear = (date: Date | string | null | undefined): string => {
    if (date) {
      return new Date(date).getFullYear().toString();
    }
    return new Date().getFullYear().toString(); // Fallback to current year
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return `Bandung, ${new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const getOrdinal = (n: number) => {
    if (n % 100 >= 11 && n % 100 <= 13) return n + "th";
    switch (n % 10) {
      case 1:
        return n + "st";
      case 2:
        return n + "nd";
      case 3:
        return n + "rd";
      default:
        return n + "th";
    }
  };

  const startYear = 2018;
  const currentYear = new Date().getFullYear();
  const editionNumber = currentYear - startYear + 1;
  const currentDateFormatted = formatDate(new Date());
  const receiptYear = getReceiptYear(invoice.updated_at);

  const getSignatureImageUrl = (picturePath: string) => {
    if (!picturePath) return null;

    if (picturePath.startsWith("http")) {
      return picturePath;
    }

    const baseUrl = "https://docssummit-api.humicprototyping.com";
    return `${baseUrl}/storage/${picturePath}`;
  };

  const signatureImageUrl = getSignatureImageUrl(invoice.picture);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Purple Header */}
        <View style={styles.Header}>
          <View style={styles.titleHeader}>
            <Text style={styles.Title}>ICICyTA {currentYear}</Text>
            <Text style={styles.subTitle}>
              The {getOrdinal(editionNumber)} International Conference on Data
              Science and Its Applications {currentYear}
            </Text>
          </View>
          {/* <Text style={styles.icodsaTitle}>
                    ICoDSA {getInvoiceYear(invoice.date_of_issue)}
                  </Text> */}
          <View style={styles.logoContainer}>
            <Image
              style={styles.largeLogoImage}
              src="/assets/images/common/university-logos/tel-u.png"
            />
            <Image
              style={styles.largeLogoImage}
              src="/assets/images/common/university-logos/unbi-university.png"
            />
            <Image
              style={styles.logoImage}
              src="/assets/images/common/university-logos/utm-university.png"
            />
            <Image
              style={styles.logoImage}
              src="/assets/images/common/university-logos/ieee-logo.png"
            />
          </View>
        </View>

        {/* Main Invoice Title */}
        <View style={styles.mainDocumentTitleSection}>
          <Text style={styles.mainDocumentTitleText}>
            CONFERENCE PAYMENT INVOICE
          </Text>
        </View>

        {/* Invoice To and Date/Invoice No. */}
        <View style={styles.invoiceInfoContainer}>
          <View style={styles.invoiceToSection}>
            <Text style={styles.sectionTitle}>INVOICE TO</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Author Names</Text>
              <Text style={styles.detailValue}>
                :{" "}
                {Array.isArray(invoice.author_names)
                  ? invoice.author_names.join(", ")
                  : invoice.author_names || "N/A"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Institution</Text>
              <Text style={styles.detailValue}>
                : {invoice.institution || "N/A"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>: {invoice.email || "N/A"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Paper ID (LoA ID)</Text>
              <Text style={styles.detailValue}>
                : {invoice.paper_id || "N/A"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Paper Title</Text>
              <Text style={styles.detailValue}>
                : {invoice.paper_title || "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.invoiceDateSection}>
            <View style={styles.detailRow}>
              <Text style={styles.dateLabel}>Date of Issue</Text>
              <Text style={styles.dateValue}>
                : {formatDateForInvoice(invoice.date_of_issue)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.dateLabel}>Invoice No.</Text>
              <Text style={styles.dateValue}>
                : {invoice.invoice_no || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.itemsTable}>
          <View style={styles.itemsTableHeaderRow}>
            <View
              style={{
                ...styles.itemsTableColHeader,
                ...styles.descriptionCol,
              }}
            >
              <Text style={styles.itemsTableHeader}>Description</Text>
            </View>
            <View
              style={{ ...styles.itemsTableColHeader, ...styles.quantityCol }}
            >
              <Text style={styles.itemsTableHeader}>Quantity</Text>
            </View>
            <View
              style={{
                ...styles.itemsTableColHeader,
                ...styles.priceCol,
                alignItems: "flex-end",
              }}
            >
              <Text style={{ ...styles.itemsTableHeader, textAlign: "right" }}>
                Price
              </Text>
            </View>
            <View
              style={{
                ...styles.itemsTableColHeader,
                ...styles.totalCol,
                alignItems: "flex-end",
              }}
            >
              <Text style={{ ...styles.itemsTableHeader, textAlign: "right" }}>
                Total
              </Text>
            </View>
          </View>
          <View style={styles.itemsTableRowLast}>
            <View style={{ ...styles.itemsTableCol, ...styles.descriptionCol }}>
              <Text style={styles.itemsTableCell}>
                {invoice.member_type || "N/A"}
              </Text>
            </View>
            <View
              style={{
                ...styles.itemsTableCol,
                ...styles.quantityCol,
                alignItems: "center",
              }}
            >
              <Text style={{ ...styles.itemsTableCell, textAlign: "center" }}>
                1
              </Text>
            </View>
            <View
              style={{
                ...styles.itemsTableCol,
                ...styles.priceCol,
                alignItems: "flex-end",
              }}
            >
              <Text style={{ ...styles.itemsTableCell, textAlign: "right" }}>
                {formatCurrencyIDR(invoice.amount)}
              </Text>
            </View>
            <View
              style={{
                ...styles.itemsTableCol,
                ...styles.totalCol,
                alignItems: "flex-end",
              }}
            >
              <Text style={{ ...styles.itemsTableCell, textAlign: "right" }}>
                {formatCurrencyIDR(invoice.amount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Sub Total Row */}
        <View style={styles.subTotalRow}>
          <View style={styles.subTotalLabelCell}>
            <Text
              style={{ fontSize: 9, fontWeight: "bold", textAlign: "right" }}
            >
              Total
            </Text>
          </View>
          <View style={styles.subTotalValueCell}>
            <Text
              style={{ fontSize: 9, fontWeight: "bold", textAlign: "right" }}
            >
              {formatCurrencyIDR(invoice.amount)}
            </Text>
          </View>
        </View>

        {/* Notes Section (adapted from icodsa, ensure relevance for icicyta) */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>
            Payment should be made after acceptance by Bank Transfer to "Bank
            Negara Indonesia (BNI)" as below:
          </Text>

          <Text style={styles.notesText}>1) Virtual Account</Text>
          <View style={{ marginLeft: 10 }}>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>
                Virtual Account Number
              </Text>
              <Text style={styles.paymentDetailValue}>
                : {invoice.nomor_virtual_akun || "N/A"}
              </Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Account Holder Name</Text>
              <Text style={styles.paymentDetailValue}>: Telkom University</Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Description</Text>
              <Text style={styles.paymentDetailValue}>
                : ICICyTA {getInvoiceYear(invoice.date_of_issue)}
              </Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Bank Name</Text>
              <Text style={styles.paymentDetailValue}>
                : Bank Negara Indonesia (BNI)
              </Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Bank Branch</Text>
              <Text style={styles.paymentDetailValue}>
                : Perintis Kemerdekaan
              </Text>
            </View>
          </View>

          <Text style={{ ...styles.notesText, marginTop: 10 }}>
            2) Bank Transfer
          </Text>
          <View style={{ marginLeft: 10 }}>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Bank Name</Text>
              <Text style={styles.paymentDetailValue}>: Bank Mandiri</Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Swift Code</Text>
              <Text style={styles.paymentDetailValue}>: BMRIIDJA</Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>
                Beneficiary name/Recipient Name
              </Text>
              <Text style={styles.paymentDetailValue}>
                : Universitas Telkom
              </Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>
                Beneficiary Bank Account No.
              </Text>
              <Text style={styles.paymentDetailValue}>
                : {invoice.beneficiary_bank_account_no || "N/A"}
              </Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Bank Branch</Text>
              <Text style={styles.paymentDetailValue}>
                : Bank Mandiri KCP Bandung Martadinata
              </Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Bank Address</Text>
              <Text style={styles.paymentDetailValue}>
                : Jl. R.E. Martadinata No.103, Kota Bandung, Jawa Barat
                Indonesia, 40115
              </Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>City</Text>
              <Text style={styles.paymentDetailValue}>: Bandung</Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Country</Text>
              <Text style={styles.paymentDetailValue}>: Indonesia</Text>
            </View>
          </View>

          <Text style={{ ...styles.notesText, marginTop: 10 }}>3) Paypal</Text>
          <View style={{ marginLeft: 10 }}>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Email</Text>
              <Text style={styles.paymentDetailValue}>
                : harry.gunawan.putu@gmail.com
              </Text>
            </View>
          </View>

          <Text style={{ ...styles.notesTitle, marginTop: 15 }}>
            Additional Important Information:
          </Text>
          <View style={styles.notesList}>
            <View style={styles.notesListItem}>
              <Text style={styles.notesListBullet}>• </Text>
              <Text style={styles.notesListText}>
                Please transfer the full registration fee plus 5% PayPal
                Currency conversion fees to our account. .
              </Text>
            </View>
            <View style={styles.notesListItem}>
              <Text style={styles.notesListBullet}>• </Text>
              <Text style={styles.notesListText}>
                Please note that the fee must be transferred under the
                registrant's name and should be stated clearly on the payment
                slip
              </Text>
            </View>
            <View style={styles.notesListItem}>
              <Text style={styles.notesListBullet}>• </Text>
              <Text style={styles.notesListText}>
                Please include the paper ID information on the payment slip.
              </Text>
            </View>
            <View style={styles.notesListItem}>
              <Text style={styles.notesListBullet}>• </Text>
              <Text style={styles.notesListText}>
                Make sure the amount transferred is the correct amount.
              </Text>
            </View>
            <View style={styles.notesListItem}>
              <Text style={styles.notesListBullet}>• </Text>
              <Text style={styles.notesListText}>
                Transfer fees (if any) are borne by the participants
              </Text>
            </View>
          </View>

          {/* Signature Section */}
          <View style={styles.signatureSection}>
            <Text style={styles.signatureDate}>{currentDateFormatted}</Text>
            {signatureImageUrl ? (
              <Image src={signatureImageUrl} style={styles.pictureUrl} />
            ) : (
              <View style={styles.signaturePlaceholderGraphic} />
            )}
            <View style={styles.signaturePlaceholderGraphic} />
            {/* <Text style={styles.signatureIcodsaLogo}>ICICyTA</Text> */}
            <Text style={styles.signatureName}>
              {invoice.nama_penandatangan}
            </Text>
            <Text style={styles.signatureTitle}>
              {invoice.jabatan_penandatangan} {receiptYear}
            </Text>
          </View>
        </View>

        {/* Footer */}
        {/* <Text style={styles.singleInvoicePageFooter}>
          The {getOrdinal(editionNumber)} International Conference on Data
          Science and Its Applications {currentYear}
        </Text> */}
      </Page>
    </Document>
  );
};

// PDF Viewer Components
export const InvoicePdfViewer: React.FC<InvoicePdfProps> = ({ invoices }) => (
  <PDFViewer width="100%" height="600px" className="mt-4">
    <InvoicePdfDocument invoices={invoices} />
  </PDFViewer>
);

export const SingleInvoicePdfViewer: React.FC<SingleInvoicePdfProps> = ({
  invoice,
}) => (
  <PDFViewer width="100%" height="600px" className="mt-4">
    <SingleInvoicePdfDocument invoice={invoice} />
  </PDFViewer>
);
