import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"

export async function downloadPDF(
  document: React.ReactElement,
  filename: string
) {
  const blob = await pdf(document).toBlob()
  saveAs(blob, filename)
}
