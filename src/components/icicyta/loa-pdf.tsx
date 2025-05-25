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
import { Loa } from "./loa-table";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 0,
    flexDirection: "column",
    backgroundColor: "#ffffff",
  },
  Header: {
    backgroundColor: "#9461AF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  Title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 10,
    textAlign: "left",
    // fontWeight: "ital",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  largeLogoImage: {
    height: 75,
    marginLeft: 8,
  },
  logoImage: {
    height: 30,
    marginLeft: 8,
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
  loaFooter: {
    position: "absolute",
    bottom: 20,
    right: 0,
    left: 0,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#9461AF",
    paddingVertical: 12,
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
  signatureIcicytaLogo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#9461AF",
    marginBottom: 3,
  },
});

interface LoaPdfProps {
  loas: Loa[];
}

// Create Document Component
export const LoaPdfDocument: React.FC<LoaPdfProps> = ({ loas }) => {
  const currentYear = new Date().getFullYear();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.Header}>
          <Text style={styles.Title}>ICICyTA {currentYear}</Text>
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
      </Page>
    </Document>
  );
};

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
export const SingleLoaPdfDocument: React.FC<SingleLoaPdfProps> = ({ loa }) => {
  const getLoaYear = (date: Date | string | null | undefined): string => {
    if (date) {
      return new Date(date).getFullYear().toString();
    }
    return new Date().getFullYear().toString(); // Fallback to current year
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
  const startYear = 2021;
  const currentYear = new Date().getFullYear();
  const editionNumber = currentYear - startYear + 1;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.Header}>
          <Text style={styles.Title}>ICICyTA {getLoaYear(loa.created_at)}</Text>
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

        <div className="flex justify-center m-10">
          <View style={styles.singleLoaContainer}>
            <View style={styles.loaField}>
              <Text style={styles.loaLabel}>LETTER OF ACCEPTANCE</Text>
              <Text style={styles.subtitle}>
                The {getOrdinal(editionNumber)} International Conference on
                Intelligent Cybernetics Technology & Application {currentYear}{" "}
                (ICIyTA)
              </Text>
            </View>

            <View style={styles.loaField}>
              <Text style={styles.loaValue}>
                Dear{" "}
                {Array.isArray(loa.author_names)
                  ? loa.author_names.join(", ")
                  : loa.author_names}
              </Text>
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
                For The {getOrdinal(editionNumber)} International Conference on
                Data Science and Its Applications {currentYear} (ICICyTA{" "}
                {currentYear}). For finishing your registration please follow
                the instruction, which has been already send by e-mail to all
                authors of accepted papers.
              </Text>
              <Text style={styles.loaLabel}>
                The {getOrdinal(editionNumber)} International Conference on Data
                Science and Its Applications {currentYear} (ICICyTA{" "}
                {currentYear}) with theme "Data for Good: Leveraging Data
                Science for Social Impact" will be held on July 10-11, 2024 at
                Aston Kuta Hotel & Residence, Bali, Indonesia.
              </Text>
            </View>

            <Text style={styles.loaValue}>{loa.tempat_tanggal}</Text>

            <View style={styles.signatureSection}>
              <Text style={styles.signatureDate}>{loa.tempat_tanggal}</Text>
              <View style={styles.signaturePlaceholderGraphic} />
              <Text style={styles.signatureIcicytaLogo}>ICIyTA</Text>
              <Text style={styles.signatureName}>Dr. Putu Harry Gunawan</Text>
              <Text style={styles.signatureTitle}>
                General Chair ICICyTA {currentYear}
              </Text>
            </View>
          </View>
        </div>

        <Text style={styles.loaFooter}>
          The {getOrdinal(editionNumber)} International Conference on Data
          Science and Its Applications {currentYear}
        </Text>
      </Page>
    </Document>
  );
};

// Single PDF Viewer Component
export const SingleLoaPdfViewer: React.FC<SingleLoaPdfProps> = ({ loa }) => (
  <PDFViewer width="100%" height="400px" className="mt-4">
    <SingleLoaPdfDocument loa={loa} />
  </PDFViewer>
);
