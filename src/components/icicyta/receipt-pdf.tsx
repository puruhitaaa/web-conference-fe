import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { Receipt } from "./receipt-table";
import { amountToWordsIDR, formatCurrencyIDR } from "../../utils/currency";

// Helper function to format date as "Month Day, Year" (e.g., Nov 01, 2024) - Kept local for specific formatting
const formatDisplayDate = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long", // ICICYTA used 'long' month, ICODSA 'short'. Keeping 'long' for now.
    day: "numeric",
    year: "numeric",
  });
};

// Extract year from date - Kept local
const getReceiptYear = (date: Date | string | null | undefined): string => {
  if (date) {
    return new Date(date).getFullYear().toString();
  }
  return new Date().getFullYear().toString(); // Fallback to current year
};

// Create styles (adapted from icodsa/receipt-pdf.tsx)
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 0, // Page padding to 0 for full-width elements
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  purpleHeader: {
    backgroundColor: "#9461AF", // ICICYTA specific color
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginBottom: 20,
  },
  conferenceNameText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    // For utm-university.png (smallest)
    height: 30,
    marginLeft: 8,
  },
  largeLogoImage: {
    // For tel-u.png and unbi-university.png
    height: 75,
    marginLeft: 8,
  },
  contentArea: {
    paddingHorizontal: 30,
  },
  mainTitleSection: {
    textAlign: "center",
    marginBottom: 25,
  },
  mainTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  topInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    fontSize: 9,
  },
  topLeftInfo: { width: "60%" },
  topRightInfo: { width: "35%", textAlign: "left" },
  infoRow: { flexDirection: "row", marginBottom: 3 },
  infoLabel: { width: "70px", fontWeight: "bold" }, // Adjusted width
  infoValue: { flex: 1 },
  infoLabelRight: { width: "80px" }, // Adjusted width

  receiptDetailsContainer: {
    marginTop: 20,
    fontSize: 11,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  detailLabel: { width: "120px", fontWeight: "bold" },
  detailValue: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    paddingBottom: 2,
  },
  amountTextValue: {
    flex: 1,
    paddingBottom: 2,
    fontStyle: "italic",
    backgroundColor: "#E6E6FA", // Light lavender for consistency with ICODSA's example
    padding: 5,
  },
  amountNumericBox: {
    backgroundColor: "#E6E6FA", // Light lavender
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    marginLeft: 120, // Align with values
    width: "150px",
    textAlign: "center",
  },
  amountNumericText: { fontSize: 12, fontWeight: "bold" },

  signatureSection: {
    marginTop: 40,
    marginBottom: 80, // Adjusted margin
    width: 200, // Fixed width for signature block
    fontSize: 9,
    alignItems: "center", // Center align items in signature block
    marginLeft: "auto", // Push to the right
    // Removed text specific alignment, handled by alignItems and direct Text styling
  },
  signatureDate: { marginBottom: 20 /* textAlign: 'center' */ }, // Centering handled by parent
  signaturePlaceholderGraphic: {
    // Replaces old signature top border
    width: 120,
    height: 40, // Placeholder for actual graphic/space
    borderBottomWidth: 1,
    borderColor: "#000000",
    marginBottom: 5,
  },
  signatureName: { fontWeight: "bold", fontSize: 10 /* textAlign: 'center' */ },
  signatureTitle: { fontSize: 9 /* textAlign: 'center' */ },
  signatureIcicytaLogo: {
    // Specific for ICICYTA
    fontSize: 14,
    fontWeight: "bold",
    color: "#9461AF", // ICICYTA header color
    marginBottom: 3,
    // textAlign: 'center', // Centering handled by parent
  },

  // Styles for multi-receipt table (adapted from icodsa)
  multiReceiptListHeader: {
    // For the "ICyTA Receipts" and "Generated on" text
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 30, // Added padding top for multi-receipt list
  },
  multiReceiptListTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  multiReceiptListSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  multiReceiptTable: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 20,
    marginHorizontal: 30,
  },
  multiReceiptHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2", // Header row background
  },
  multiReceiptDataRow: {
    // For data rows, no specific background by default
    flexDirection: "row",
  },
  multiReceiptTableCol: {
    width: "20%", // 5 columns
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
    overflow: "hidden", // Prevent text overflow issues
  },
  multiReceiptTableCell: {
    margin: 2, // Adjusted from 5
    fontSize: 9, // Adjusted from 10
  },
  multiReceiptTableHeader: {
    margin: 2, // Adjusted from 5
    fontSize: 9, // Adjusted from 10
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "grey",
  },
});

// Multiple Receipts PDF Props
interface ReceiptPdfProps {
  receipts: Receipt[];
}

// Create Document Component for multiple receipts
export const ReceiptPdfDocument: React.FC<ReceiptPdfProps> = ({ receipts }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.multiReceiptListHeader}>
        <Text style={styles.multiReceiptListTitle}>ICyTA Receipts</Text>
        <Text style={styles.multiReceiptListSubtitle}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.multiReceiptTable}>
        <View style={styles.multiReceiptHeaderRow}>
          <View style={styles.multiReceiptTableCol}>
            <Text style={styles.multiReceiptTableHeader}>Invoice #</Text>
          </View>
          <View style={styles.multiReceiptTableCol}>
            <Text style={styles.multiReceiptTableHeader}>Received From</Text>
          </View>
          <View style={styles.multiReceiptTableCol}>
            <Text style={styles.multiReceiptTableHeader}>Paper ID</Text>
          </View>
          <View style={styles.multiReceiptTableCol}>
            <Text style={styles.multiReceiptTableHeader}>Amount</Text>
          </View>
          <View style={styles.multiReceiptTableCol}>
            <Text style={styles.multiReceiptTableHeader}>Payment Date</Text>
          </View>
        </View>

        {receipts.map((receipt, i) => (
          <View key={receipt.id || i} style={styles.multiReceiptDataRow}>
            {" "}
            {/* Use receipt.id */}
            <View style={styles.multiReceiptTableCol}>
              <Text style={styles.multiReceiptTableCell}>
                {receipt.invoice_no || "N/A"}
              </Text>
            </View>
            <View style={styles.multiReceiptTableCol}>
              <Text style={styles.multiReceiptTableCell}>
                {receipt.received_from || "N/A"}
              </Text>
            </View>
            <View style={styles.multiReceiptTableCol}>
              <Text style={styles.multiReceiptTableCell}>
                {receipt.paper_id || "N/A"}
              </Text>
            </View>
            <View style={styles.multiReceiptTableCol}>
              <Text style={styles.multiReceiptTableCell}>
                {formatCurrencyIDR(receipt.amount)}
              </Text>
            </View>
            <View style={styles.multiReceiptTableCol}>
              <Text style={styles.multiReceiptTableCell}>
                {formatDisplayDate(receipt.payment_date)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        This is an automatically generated document. For more information,
        please contact the conference organizers.
      </Text>
    </Page>
  </Document>
);

// Single Receipt PDF Props
interface SingleReceiptPdfProps {
  receipt: Receipt;
}

// Create Single Receipt Document Component
export const SingleReceiptPdfDocument: React.FC<SingleReceiptPdfProps> = ({
  receipt,
}) => {
  const receiptYear = getReceiptYear(receipt.payment_date);
  const currentDateFormatted = formatDisplayDate(new Date()); // For "Date of Issue" for signature

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Purple Header with Logos */}
        <View style={styles.purpleHeader}>
          <Text style={styles.conferenceNameText}>ICyTA {receiptYear}</Text>
        </View>
        <View style={styles.contentArea}>
          {" "}
          {/* Main content wrapper for padding */}
          {/* Main Title */}
          <View style={styles.mainTitleSection}>
            <Text style={styles.mainTitleText}>CONFERENCE PAYMENT RECEIPT</Text>
          </View>
          {/* Top Info: Paper ID/Title and Date/Invoice No. */}
          <View style={styles.topInfoContainer}>
            <View style={styles.topLeftInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Paper ID</Text>
                <Text style={styles.infoValue}>
                  : {receipt.paper_id || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Title</Text>
                <Text style={styles.infoValue}>
                  : {receipt.paper_title || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.topRightInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabelRight}>Date of Issue</Text>
                <Text style={styles.infoValue}>
                  : {formatDisplayDate(receipt.created_at || new Date())}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabelRight}>Invoice No.</Text>
                <Text style={styles.infoValue}>
                  : {receipt.invoice_no || "N/A"}
                </Text>
              </View>
            </View>
          </View>
          {/* Receipt Details */}
          <View style={styles.receiptDetailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Received from</Text>
              <Text style={styles.detailValue}>
                {receipt.received_from || "N/A"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.amountTextValue}>
                {amountToWordsIDR(receipt.amount)}
              </Text>
            </View>
            <View style={styles.amountNumericBox}>
              <Text style={styles.amountNumericText}>
                {formatCurrencyIDR(receipt.amount)}
              </Text>
            </View>
            <View style={{ ...styles.detailItem, marginTop: 20 }}>
              <Text style={styles.detailLabel}>In Payment of</Text>
              <Text style={styles.detailValue}>
                {receipt.in_payment_of || "N/A"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Payment Date</Text>
              <Text style={styles.detailValue}>
                {formatDisplayDate(receipt.payment_date)}
              </Text>
            </View>
          </View>
          {/* Signature Section */}
          <View style={styles.signatureSection}>
            <Text style={styles.signatureDate}>
              Bandung, {currentDateFormatted}
            </Text>
            <View style={styles.signaturePlaceholderGraphic} />
            <Text style={styles.signatureIcicytaLogo}>ICyTA</Text>{" "}
            {/* Changed from ICoDSA */}
            <Text style={styles.signatureName}>
              Dr. Putu Harry Gunawan
            </Text>{" "}
            {/* Placeholder name */}
            <Text style={styles.signatureTitle}>
              General Chair ICyTA {receiptYear}
            </Text>{" "}
            {/* Changed */}
          </View>
        </View>{" "}
        {/* End of contentArea */}
        {/* Footer can be added here if a specific one is needed, or use generic */}
        {/* <Text style={styles.footer}>
          The International Conference on Intelligent Cybernetics Technology and Applications {receiptYear}
        </Text> */}
      </Page>
    </Document>
  );
};

// PDF Viewer Components
export const ReceiptPdfViewer: React.FC<ReceiptPdfProps> = ({ receipts }) => (
  <PDFViewer width="100%" height="600px" className="mt-4">
    <ReceiptPdfDocument receipts={receipts} />
  </PDFViewer>
);

export const SingleReceiptPdfViewer: React.FC<SingleReceiptPdfProps> = ({
  receipt,
}) => (
  <PDFViewer width="100%" height="600px" className="mt-4">
    <SingleReceiptPdfDocument receipt={receipt} />
  </PDFViewer>
);
