import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer"
import { Invoice } from "./invoice-table"

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 0,
    fontSize: 10,
  },
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
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
  },
  multiInvoiceTableCell: {
    margin: 5,
    fontSize: 10,
  },
  multiInvoiceTableHeader: {
    margin: 5,
    fontSize: 10,
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
  purpleHeader: {
    backgroundColor: "#59c3d0",
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icodsaTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    height: 30,
    marginLeft: 8,
  },
  largeLogoImage: {
    height: 75,
    marginLeft: 8,
  },
  conferencePaymentInvoiceTitle: {
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  conferenceTitleText: {
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

  itemsTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
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

  // singleInvoicePageFooter: {
  //   position: "absolute",
  //   bottom: 20,
  //   left: 30,
  //   right: 30,
  //   textAlign: "center",
  //   fontSize: 9,
  //   color: "#FFFFFF",
  //   backgroundColor: "#4A007F",
  //   paddingVertical: 10,
  // },

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
  },
})

// Multiple Invoices PDF Props
interface InvoicePdfProps {
  invoices: Invoice[]
}

// Create Document Component for multiple invoices
export const InvoicePdfDocument: React.FC<InvoicePdfProps> = ({ invoices }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.multiInvoiceHeader}>
        <Text style={styles.multiInvoiceTitle}>ICoDSA Invoices</Text>
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
                {invoice.amount !== null && invoice.amount !== undefined
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(invoice.amount)
                  : "N/A"}
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
)

// Single Invoice PDF Props
interface SingleInvoicePdfProps {
  invoice: Invoice
}

// Create Single Invoice Document Component
export const SingleInvoicePdfDocument: React.FC<SingleInvoicePdfProps> = ({
  invoice,
}) => {
  const getInvoiceYear = (date: Date | string | null | undefined): string => {
    if (date) {
      return new Date(date).getFullYear().toString()
    }
    return new Date().getFullYear().toString() // Fallback to current year
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A"
    return `Bandung, ${new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A"
    const numberFormatter = new Intl.NumberFormat("id-ID", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return `IDR ${numberFormatter.format(amount)}`
  }

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Purple Header */}
        <View style={styles.purpleHeader}>
          <Text style={styles.icodsaTitle}>
            ICoDSA {getInvoiceYear(invoice.date_of_issue)}
          </Text>
          <View style={styles.logoContainer}>
            <Image
              style={styles.largeLogoImage}
              src='/assets/images/common/university-logos/tel-u.png'
            />
            <Image
              style={styles.largeLogoImage}
              src='/assets/images/common/university-logos/unbi-university.png'
            />
            <Image
              style={styles.logoImage}
              src='/assets/images/common/university-logos/utm-university.png'
            />
          </View>
        </View>

        {/* Main Invoice Title */}
        <View style={styles.conferencePaymentInvoiceTitle}>
          <Text style={styles.conferenceTitleText}>
            CONFERENCE PAYMENT INVOICE
          </Text>
        </View>

        {/* Invoice To and Date/Invoice No. */}
        <View style={styles.invoiceInfoContainer}>
          <View style={styles.invoiceToSection}>
            <Text style={styles.sectionTitle}>INVOICE TO</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Author Type</Text>
              <Text style={styles.detailValue}>
                : {invoice.author_type || "N/A"}
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
              <Text style={styles.detailLabel}>Paper ID</Text>
              <Text style={styles.detailValue}>
                : {invoice.loa_id || "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.invoiceDateSection}>
            <View style={styles.detailRow}>
              <Text style={styles.dateLabel}>Date of Issue</Text>
              <Text style={styles.dateValue}>
                : {formatDate(invoice.date_of_issue)}
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
          {/* Table Header */}
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

          {/* Table Row */}
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
                {formatCurrency(invoice.amount)}
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
                {formatCurrency(invoice.amount)}
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
              {formatCurrency(invoice.amount)}
            </Text>
          </View>
        </View>

        {/* Notes Section */}
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
                : {invoice.virtual_account_id || "8321066202400048 (Fallback)"}
              </Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Account Holder Name</Text>
              <Text style={styles.paymentDetailValue}>: Telkom University</Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Description</Text>
              <Text style={styles.paymentDetailValue}>
                : ICoDSA {getInvoiceYear(invoice.date_of_issue)}
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
                : {invoice.bank_transfer_id || "1310095019917 (Fallback)"}
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
                Currency conversion fees to our account.
              </Text>
            </View>
            <View style={styles.notesListItem}>
              <Text style={styles.notesListBullet}>• </Text>
              <Text style={styles.notesListText}>
                Please note that the fee must be transferred under the
                registrant's name and should be stated clearly on the payment
                slip.
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
          </View>
        </View>

        {/* Footer */}
        {/* <Text style={styles.singleInvoicePageFooter}>
          The 3rd International Conference on Intelligent Cybernetics Technology
          and Applications {new Date().getFullYear()}
        </Text> */}
      </Page>
    </Document>
  )
}

// PDF Viewer Components
export const InvoicePdfViewer: React.FC<InvoicePdfProps> = ({ invoices }) => (
  <PDFViewer width='100%' height='600px' className='mt-4'>
    <InvoicePdfDocument invoices={invoices} />
  </PDFViewer>
)

export const SingleInvoicePdfViewer: React.FC<SingleInvoicePdfProps> = ({
  invoice,
}) => (
  <PDFViewer width='100%' height='600px' className='mt-4'>
    <SingleInvoicePdfDocument invoice={invoice} />
  </PDFViewer>
)
