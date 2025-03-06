import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { Invoice } from "./invoice-table";

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
  // Single invoice styles
  singleInvoiceContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  invoiceDetails: {
    marginBottom: 20,
  },
  invoiceField: {
    marginBottom: 10,
  },
  invoiceLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  invoiceValue: {
    fontSize: 12,
    marginTop: 3,
  },
  invoiceItems: {
    marginTop: 20,
    marginBottom: 20,
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

// Multiple Invoices PDF Props
interface InvoicePdfProps {
  invoices: Invoice[];
}

// Create Document Component for multiple invoices
export const InvoicePdfDocument: React.FC<InvoicePdfProps> = ({ invoices }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>ICODSA Invoices</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Invoice #</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Author Name</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Paper ID</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Paper Title</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Total</Text>
          </View>
        </View>

        {invoices.map((invoice, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{invoice.invoiceNumber}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{invoice.authorName}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{invoice.paperId}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{invoice.paperTitle}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(invoice.total)}
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

// Single Invoice PDF Props
interface SingleInvoicePdfProps {
  invoice: Invoice;
}

// Create Single Invoice Document Component
export const SingleInvoicePdfDocument: React.FC<SingleInvoicePdfProps> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Text style={styles.subtitle}>ICODSA Conference</Text>
      </View>

      <View style={styles.invoiceHeader}>
        <View>
          <Text style={styles.invoiceLabel}>Invoice Number:</Text>
          <Text style={styles.invoiceValue}>{invoice.invoiceNumber}</Text>
        </View>
        <View>
          <Text style={styles.invoiceLabel}>Date:</Text>
          <Text style={styles.invoiceValue}>{invoice.placeAndDate}</Text>
        </View>
      </View>

      <View style={styles.invoiceDetails}>
        <View style={styles.invoiceField}>
          <Text style={styles.invoiceLabel}>To:</Text>
          <Text style={styles.invoiceValue}>{invoice.authorName}</Text>
          <Text style={styles.invoiceValue}>{invoice.institution}</Text>
          <Text style={styles.invoiceValue}>{invoice.email}</Text>
        </View>
        
        <View style={styles.invoiceField}>
          <Text style={styles.invoiceLabel}>Paper ID:</Text>
          <Text style={styles.invoiceValue}>{invoice.paperId}</Text>
        </View>
        
        <View style={styles.invoiceField}>
          <Text style={styles.invoiceLabel}>Paper Title:</Text>
          <Text style={styles.invoiceValue}>{invoice.paperTitle}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <View style={{...styles.tableCol, width: "50%"}}>
            <Text style={styles.tableHeader}>Description</Text>
          </View>
          <View style={{...styles.tableCol, width: "15%"}}>
            <Text style={styles.tableHeader}>Quantity</Text>
          </View>
          <View style={{...styles.tableCol, width: "15%"}}>
            <Text style={styles.tableHeader}>Price</Text>
          </View>
          <View style={{...styles.tableCol, width: "20%"}}>
            <Text style={styles.tableHeader}>Total</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={{...styles.tableCol, width: "50%"}}>
            <Text style={styles.tableCell}>{invoice.description}</Text>
          </View>
          <View style={{...styles.tableCol, width: "15%"}}>
            <Text style={styles.tableCell}>{invoice.quantity}</Text>
          </View>
          <View style={{...styles.tableCol, width: "15%"}}>
            <Text style={styles.tableCell}>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(invoice.price)}
            </Text>
          </View>
          <View style={{...styles.tableCol, width: "20%"}}>
            <Text style={styles.tableCell}>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(invoice.total)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(invoice.total)}
        </Text>
      </View>

      <View style={styles.signature}>
        <Text style={styles.invoiceValue}>{invoice.signature}</Text>
        <Text style={styles.invoiceLabel}>{invoice.department}</Text>
      </View>

      <Text style={styles.footer}>
        This is an officially generated Invoice for ICODSA Conference.
      </Text>
    </Page>
  </Document>
);

// PDF Viewer Components
export const InvoicePdfViewer: React.FC<InvoicePdfProps> = ({ invoices }) => (
  <PDFViewer width="100%" height="600px" className="mt-4">
    <InvoicePdfDocument invoices={invoices} />
  </PDFViewer>
);

export const SingleInvoicePdfViewer: React.FC<SingleInvoicePdfProps> = ({ invoice }) => (
  <PDFViewer width="100%" height="600px" className="mt-4">
    <SingleInvoicePdfDocument invoice={invoice} />
  </PDFViewer>
);