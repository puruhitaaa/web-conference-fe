import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { Loa } from "./loa-table";

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
    width: "25%",
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
  statusAccepted: {
    color: "green",
    fontWeight: "bold",
  },
  statusRejected: {
    color: "red",
    fontWeight: "bold",
  },
  // Add styles for single LoA view
  singleLoaContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  loaHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  loaField: {
    marginBottom: 10,
  },
  loaLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  loaValue: {
    fontSize: 12,
    marginTop: 3,
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

interface LoaPdfProps {
  loas: Loa[];
}

// Create Document Component
export const LoaPdfDocument: React.FC<LoaPdfProps> = ({ loas }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>ICODSA Letters of Acceptance</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Paper ID</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Author Name</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Conference Title</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>Status</Text>
          </View>
        </View>

        {loas.map((loa, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{loa.paperId}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{loa.authorName}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{loa.conferenceTitle}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text 
                style={[
                  styles.tableCell, 
                  loa.status === "accepted" ? styles.statusAccepted : styles.statusRejected
                ]}
              >
                {loa.status}
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

// PDF Viewer Component
export const LoaPdfViewer: React.FC<LoaPdfProps> = ({ loas }) => (
  <PDFViewer width="100%" height="600px" className="mt-4">
    <LoaPdfDocument loas={loas} />
  </PDFViewer>
);
// Single LoA PDF Props
interface SingleLoaPdfProps {
  loa: Loa;
}

// Create Single LoA Document Component
export const SingleLoaPdfDocument: React.FC<SingleLoaPdfProps> = ({ loa }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Letter of Acceptance</Text>
        <Text style={styles.subtitle}>ICODSA Conference</Text>
      </View>

      <View style={styles.singleLoaContainer}>
        <View style={styles.loaField}>
          <Text style={styles.loaLabel}>Paper ID:</Text>
          <Text style={styles.loaValue}>{loa.paperId}</Text>
        </View>
        
        <View style={styles.loaField}>
          <Text style={styles.loaLabel}>Author Name:</Text>
          <Text style={styles.loaValue}>{loa.authorName}</Text>
        </View>
        
        <View style={styles.loaField}>
          <Text style={styles.loaLabel}>Conference Title:</Text>
          <Text style={styles.loaValue}>{loa.conferenceTitle}</Text>
        </View>
        
        <View style={styles.loaField}>
          <Text style={styles.loaLabel}>Time:</Text>
          <Text style={styles.loaValue}>{loa.time}</Text>
        </View>
        
        <View style={styles.loaField}>
          <Text style={styles.loaLabel}>Place and Date:</Text>
          <Text style={styles.loaValue}>{loa.placeAndDate}</Text>
        </View>
        
        <View style={styles.loaField}>
          <Text style={styles.loaLabel}>Status:</Text>
          <Text style={[
            styles.loaValue, 
            loa.status === "accepted" ? styles.statusAccepted : styles.statusRejected
          ]}>
            {loa.status.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.loaField}>
          <Text style={styles.loaLabel}>Department:</Text>
          <Text style={styles.loaValue}>{loa.department}</Text>
        </View>
        
        <View style={styles.signature}>
          <Text style={styles.loaValue}>{loa.signature}</Text>
          <Text style={styles.loaLabel}>Signature</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        This is an officially generated Letter of Acceptance for ICODSA Conference.
      </Text>
    </Page>
  </Document>
);

// Single PDF Viewer Component
export const SingleLoaPdfViewer: React.FC<SingleLoaPdfProps> = ({ loa }) => (
  <PDFViewer width="100%" height="600px" className="mt-4">
    <SingleLoaPdfDocument loa={loa} />
  </PDFViewer>
);