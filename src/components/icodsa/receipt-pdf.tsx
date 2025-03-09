import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { Receipt } from "./receipt-table";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  tableHeader: {
    margin: 5,
    fontSize: 10,
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
  // Single receipt styles
  singleReceiptContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  receiptDetails: {
    marginBottom: 20,
  },
  receiptField: {
    marginBottom: 10,
  },
  receiptLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  receiptValue: {
    fontSize: 12,
    marginTop: 3,
  },
  statusPaid: {
    color: "green",
    fontWeight: "bold",
  },
  statusPending: {
    color: "orange",
    fontWeight: "bold",
  },
  statusCancelled: {
    color: "red",
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    paddingTop: 5,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  signature: {
    marginTop: 50,
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    paddingTop: 10,
    width: 200,
    textAlign: "center",
  }
});

// Multiple Receipts PDF Props
interface ReceiptPdfProps {
  receipts: Receipt[];
}

// Create Document Component for multiple receipts
export const ReceiptPdfDocument: React.FC<ReceiptPdfProps> = ({ receipts }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>ICODSA Receipts</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Receipt #</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Author Name</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Paper ID</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Amount</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Status</Text>
          </View>
        </View>

        {receipts.map((receipt, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{receipt.receiptNumber}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{receipt.authorName}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{receipt.paperId}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(receipt.amount)}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text 
                style={[
                  styles.tableCell, 
                  receipt.status === "paid" ? styles.statusPaid : 
                  receipt.status === "pending" ? styles.statusPending : styles.statusCancelled
                ]}
              >
                {receipt.status.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        This is an automatically generated document. For more information, please contact the conference organizers.
      </Text>
    </Page>
  </Document>
);

// Single Receipt PDF Props
interface SingleReceiptPdfProps {
  receipt: Receipt;
}

// Create Single Receipt Document Component
export const SingleReceiptPdfDocument: React.FC<SingleReceiptPdfProps> = ({ receipt }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>RECEIPT</Text>
        <Text style={styles.subtitle}>ICODSA Conference</Text>
      </View>

      <View style={styles.receiptHeader}>
        <View>
          <Text style={styles.receiptLabel}>Receipt Number:</Text>
          <Text style={styles.receiptValue}>{receipt.receiptNumber}</Text>
        </View>
        <View>
          <Text style={styles.receiptLabel}>Date:</Text>
          <Text style={styles.receiptValue}>{receipt.placeAndDate}</Text>
        </View>
      </View>

      <View style={styles.receiptDetails}>
        <View style={styles.receiptField}>
          <Text style={styles.receiptLabel}>To:</Text>
          <Text style={styles.receiptValue}>{receipt.authorName}</Text>
          <Text style={styles.receiptValue}>{receipt.institution}</Text>
          <Text style={styles.receiptValue}>{receipt.email}</Text>
        </View>
        
        <View style={styles.receiptField}>
          <Text style={styles.receiptLabel}>Paper ID:</Text>
          <Text style={styles.receiptValue}>{receipt.paperId}</Text>
        </View>
        
        <View style={styles.receiptField}>
          <Text style={styles.receiptLabel}>Paper Title:</Text>
          <Text style={styles.receiptValue}>{receipt.paperTitle}</Text>
        </View>
        
        <View style={styles.receiptField}>
          <Text style={styles.receiptLabel}>Description:</Text>
          <Text style={styles.receiptValue}>{receipt.description}</Text>
        </View>
        
        <View style={styles.receiptField}>
          <Text style={styles.receiptLabel}>Payment Method:</Text>
          <Text style={styles.receiptValue}>{receipt.paymentMethod}</Text>
        </View>
        
        <View style={styles.receiptField}>
          <Text style={styles.receiptLabel}>Payment Date:</Text>
          <Text style={styles.receiptValue}>{receipt.paymentDate}</Text>
        </View>
        
        <View style={styles.receiptField}>
          <Text style={styles.receiptLabel}>Status:</Text>
          <Text style={[
            styles.receiptValue, 
            receipt.status === "paid" ? styles.statusPaid : 
            receipt.status === "pending" ? styles.statusPending : styles.statusCancelled
          ]}>
            {receipt.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalValue}>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(receipt.amount)}
        </Text>
      </View>

      {receipt.notes && (
        <View style={styles.receiptField}>
          <Text style={styles.receiptLabel}>Notes:</Text>
          <Text style={styles.receiptValue}>{receipt.notes}</Text>
        </View>
      )}

      <Text style={styles.footer}>
        This is an officially generated Receipt for ICODSA Conference.
      </Text>
    </Page>
  </Document>
);

// PDF Viewer Components
export const ReceiptPdfViewer: React.FC<ReceiptPdfProps> = ({ receipts }) => (
  <PDFViewer width="100%" height="600px" className="mt-4">
    <ReceiptPdfDocument receipts={receipts} />
  </PDFViewer>
);

export const SingleReceiptPdfViewer: React.FC<SingleReceiptPdfProps> = ({ receipt }) => (
  <PDFViewer width="100%" height="600px" className="mt-4">
    <SingleReceiptPdfDocument receipt={receipt} />
  </PDFViewer>
);