import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { Loa } from "./loa-table";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    flexDirection: "column",
    backgroundColor: "#ffffff",
  },
  header: {
    color: "#ffffff",
    padding: 20,
    textAlign: "center",
    backgroundColor: "#9461AF",
  },
  title: {
    textAlign: "left",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "left",
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    margin: 20,
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
    margin: 20,
    paddingTop: 20,
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
    fontSize: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  loaValue: {
    fontSize: 10,
    marginTop: 3,
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
});

interface LoaPdfProps {
  loas: Loa[];
}

// Create Document Component
export const LoaPdfDocument: React.FC<LoaPdfProps> = ({ loas }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>ICICYTA {new Date().getFullYear()}</Text>
        <Text style={styles.subtitle}>
          The 4TH International Conference on Intelligent Cybernetics Technology
          & Applications {new Date().getFullYear()} (ICICyTA{" "}
          {new Date().getFullYear()})
        </Text>
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
              <Text style={styles.tableCell}>{loa.paper_id}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{loa.author_names}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{loa.paper_title}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text
                style={[
                  styles.tableCell,
                  loa.status === "Accepted"
                    ? styles.statusAccepted
                    : styles.statusRejected,
                ]}
              >
                {loa.status}
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
        <Text style={styles.title}>ICICYTA {new Date().getFullYear()}</Text>
        <Text style={styles.subtitle}>
          The 4TH International Conference on Intelligent Cybernetics Technology
          & Applications {new Date().getFullYear()} (ICICyTA{" "}
          {new Date().getFullYear()})
        </Text>
      </View>

      <div className="flex justify-center m-10">
        <View style={styles.singleLoaContainer}>
          <View style={styles.loaField}>
            <Text style={styles.loaLabel}>LETTER OF ACCEPTANCE</Text>
            <Text style={styles.subtitle}>
              The 4th International Conference on Intelligent Cybernetics
              Technology & Application {new Date().getFullYear()} (ICODSA)
            </Text>
          </View>

          <View style={styles.loaField}>
            <Text style={styles.loaValue}>Dear {loa.author_names}</Text>
          </View>

          <View style={styles.loaField}>
            <Text style={styles.loaLabel}>
              Organizing & Program Committee is pleased to announce that your
              paper:
            </Text>
            <Text style={styles.loaValue}>
              {loa.paper_id}: {loa.paper_title}
            </Text>
          </View>

          <View style={styles.loaField}>
            <Text style={styles.loaLabel}>Was</Text>
            <Text
              style={[
                styles.loaValue,
                loa.status === "Accepted"
                  ? styles.statusAccepted
                  : styles.statusRejected,
              ]}
            >
              {loa.status.toUpperCase()}
            </Text>
          </View>

          <View style={styles.loaField}>
            <Text style={styles.loaLabel}>
              For The 4th International Conference on Intelligent Cybernetics
              Technology & Applications {new Date().getFullYear()} (ICICyTA).
              For finishing your registration please follow the instruction,
              which has been already send by e-mail to all authors of accepted
              papers.
            </Text>
            <Text style={styles.loaLabel}>
              The 4th International Conference on Intelligent Cybernetics
              Technology & Applications {new Date().getFullYear()} (ICICyTA{" "}
              {new Date().getFullYear()}) with theme "From Data to Decisions:
              Cybernetics and Intelligent Systems in Healthcare, IoT, and
              Business" will be held on December 17-19, 2024 at Bali Indonesia.
            </Text>
          </View>

          <Text style={styles.loaValue}>{loa.tempat_tanggal}</Text>

          <View style={styles.signature}>
            <Text style={styles.loaValue}>{loa.signature_id}</Text>
            <Text style={styles.loaLabel}>Signature</Text>
          </View>
        </View>
      </div>

      <Text style={styles.footer}>
        This is an officially generated Letter of Acceptance for ICODSA
        Conference.
      </Text>
    </Page>
  </Document>
);

// Single PDF Viewer Component
export const SingleLoaPdfViewer: React.FC<SingleLoaPdfProps> = ({ loa }) => (
  <PDFViewer width="100%" height="400px" className="mt-4">
    <SingleLoaPdfDocument loa={loa} />
  </PDFViewer>
);
