import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  ReceiptPdfViewer,
  SingleReceiptPdfViewer,
  ReceiptPdfDocument,
  SingleReceiptPdfDocument,
} from "./receipt-pdf"
import { Receipt } from "./receipt-table"
import { Download } from "lucide-react"
import { downloadPDF } from "@/lib/pdf-utils"

interface PrintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: Receipt[] | Receipt
  title: string
  description?: string
  singleMode?: boolean
}

export function ReceiptPrintDialog({
  open,
  onOpenChange,
  data,
  title,
  description,
  singleMode = false,
}: PrintDialogProps) {
  const handleDownload = async () => {
    if (singleMode && !Array.isArray(data)) {
      await downloadPDF(
        <SingleReceiptPdfDocument receipt={data} />,
        `receipt-${data.receiptNumber}.pdf`
      )
    } else {
      await downloadPDF(
        <ReceiptPdfDocument receipts={Array.isArray(data) ? data : [data]} />,
        "icicyta-receipts.pdf"
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className='py-4'>
          {singleMode && !Array.isArray(data) ? (
            <SingleReceiptPdfViewer receipt={data} />
          ) : (
            <ReceiptPdfViewer receipts={Array.isArray(data) ? data : [data]} />
          )}
        </div>
        <DialogFooter className='flex gap-2'>
          <Button
            variant='outline'
            onClick={handleDownload}
            className='flex items-center'
          >
            <Download className='mr-2 h-4 w-4' />
            Download PDF
          </Button>
          <Button variant='secondary' onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
