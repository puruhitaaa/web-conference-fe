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
import { Receipt } from "./receipt-table";
import { amountToWordsIDR, formatCurrencyIDR } from "../../utils/currency";

// Helper function to get year from date
const getReceiptYear = (date: Date | string | null | undefined): string => {
  if (date) {
    return new Date(date).getFullYear().toString();
  }
  return new Date().getFullYear().toString(); // Fallback to current year
};

// Helper function to format date as "Month Day, Year" (e.g., Nov 01, 2024)
const formatDisplayDate = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Create styles (similar to icicyta/receipt-pdf for consistency)
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 0, // Page padding to 0 for full-width elements
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  purpleHeader: {
    backgroundColor: "#59c3d0", // ICODSA color (previously #4A007F, then #59c3d0)
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginBottom: 20, // Consistent with icicyta invoice
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    height: 75, // As per previous adjustments
    marginLeft: 8,
  },
  // Styles for the main content area of the receipt (titles, details)
  contentArea: {
    // Wrapper for content that needs padding
    paddingHorizontal: 30,
  },
  mainTitleSection: {
    textAlign: "center",
    marginBottom: 25,
    // paddingHorizontal: 30, // Moved to contentArea
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
    // paddingHorizontal: 30, // Moved to contentArea
  },
  topLeftInfo: { width: "60%" },
  topRightInfo: { width: "35%", textAlign: "left" },
  infoRow: { flexDirection: "row", marginBottom: 3 },
  infoLabel: { width: "70px", fontWeight: "bold" },
  infoValue: { flex: 1 },
  infoLabelRight: { width: "80px" },

  receiptDetailsContainer: {
    // paddingHorizontal: 30, // Moved to contentArea
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
    backgroundColor: "#E6E6FA",
    padding: 5,
  },
  amountNumericBox: {
    backgroundColor: "#E6E6FA",
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
    marginBottom: 80,
    width: 200,
    fontSize: 9,
    alignItems: "center",
    marginLeft: "auto",
  },
  signatureDate: { marginBottom: 20 },
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
    color: "#59c3d0", // Match header color
    marginBottom: 3,
  },
  multiReceiptTable: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 20,
    marginHorizontal: 30, // For padding in multi-view
  },
  multiReceiptHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
  },
  multiReceiptTableCol: {
    width: "20%", // 5 columns: invoice_no, received_from, paper_id, amount, payment_date
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
    overflow: "hidden",
  },
  multiReceiptTableCell: {
    margin: 2,
    fontSize: 9,
  },
  multiReceiptTableHeader: {
    margin: 2,
    fontSize: 9,
    fontWeight: "bold",
  },
  footer: {
    // Generic footer for all pages if needed
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 12,
    color: "#ffffff",
    backgroundColor: "#59c3d0",
    paddingVertical: 20,
  },
  // purpleFooter: { // Specific footer, replaced by generic or removed for now from single view
  //   position: "absolute",
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: "#59c3d0", // Match header color
  //   paddingHorizontal: 30,
  //   paddingVertical: 10,
  //   textAlign: "center",
  // },
  // footerText: {
  //   fontSize: 9,
  //   color: "#ffffff",
  // },
});

// Multiple Receipts PDF Props
interface ReceiptPdfProps {
  receipts: Receipt[];
}

// Document Component for multiple receipts
export const ReceiptPdfDocument: React.FC<ReceiptPdfProps> = ({ receipts }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
        {" "}
        {/* Add overall padding for multi-receipt content */}
        <Text
          style={{
            fontSize: 24,
            textAlign: "center",
            marginBottom: 10,
            fontWeight: "bold",
          }}
        >
          ICoDSA Receipts
        </Text>
        <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 20 }}>
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
          <View key={receipt.id || i} style={styles.multiReceiptHeaderRow}>
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

// Single Receipt Document Component
export const SingleReceiptPdfDocument: React.FC<SingleReceiptPdfProps> = ({
  receipt,
}) => {
  const receiptYear = getReceiptYear(receipt.payment_date);
  const currentDateFormatted = formatDisplayDate(new Date()); // For "Date of Issue" for signature

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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Purple Header with Logos */}
        <View style={styles.purpleHeader}>
          <Text style={styles.conferenceNameText}>ICoDSA {receiptYear}</Text>
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
          </View>
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
              {/* Date of Issue for the receipt itself can be receipt.created_at or current date */}
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
            <Text style={styles.signatureDate}>{currentDateFormatted}</Text>
            <View style={styles.signaturePlaceholderGraphic} />
            <Text style={styles.signatureIcodsaLogo}>ICoDSA</Text>
            <Text style={styles.signatureName}>Dr. Putu Harry Gunawan</Text>
            <Text style={styles.signatureTitle}>
              General Chair ICoDSA {receiptYear}
            </Text>
          </View>
        </View>{" "}
        {/* End of contentArea */}
        {/* Footer - using the generic one from styles */}
        <Text style={styles.footer}>
          The {getOrdinal(editionNumber)} International Conference on
          Intelligent Cybernetics Technology and Applications {currentYear}
        </Text>
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
