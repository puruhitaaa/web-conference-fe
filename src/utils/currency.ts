const satuan = [
  "",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
]
const belasan = [
  "sepuluh",
  "sebelas",
  "dua belas",
  "tiga belas",
  "empat belas",
  "lima belas",
  "enam belas",
  "tujuh belas",
  "delapan belas",
  "sembilan belas",
]
const puluhan = [
  "",
  "",
  "dua puluh",
  "tiga puluh",
  "empat puluh",
  "lima puluh",
  "enam puluh",
  "tujuh puluh",
  "delapan puluh",
  "sembilan puluh",
]
const ribuan = ["", "ribu", "juta", "miliar", "triliun"] // Up to triliun

const convertThreeDigits = (num: number): string => {
  let result = ""
  const hundred = Math.floor(num / 100)
  const remainder = num % 100

  if (hundred > 0) {
    result += hundred === 1 ? "seratus" : `${satuan[hundred]} ratus`
    if (remainder > 0) {
      result += " "
    }
  }

  if (remainder > 0) {
    if (remainder < 10) {
      result += satuan[remainder]
    } else if (remainder < 20) {
      result += belasan[remainder - 10]
    } else {
      const ten = Math.floor(remainder / 10)
      const one = remainder % 10
      result += puluhan[ten]
      if (one > 0) {
        result += ` ${satuan[one]}`
      }
    }
  }
  return result
}

export const amountToWordsIDR = (
  amount: string | number | null | undefined
): string => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount

  if (
    numericAmount === null ||
    numericAmount === undefined ||
    isNaN(numericAmount)
  ) {
    return "N/A"
  }

  if (numericAmount === 0) {
    return "nol Rupiah"
  }

  let words = ""
  let tempAmount = Math.floor(numericAmount) // Use floor to handle potential decimals from parseFloat
  let chunkIndex = 0

  if (tempAmount === 0 && numericAmount > 0) {
    // Handle cases like 0.5
    // For now, if it's purely decimal and less than 1, we'll indicate it.
    // A full decimal to words conversion is more complex and not explicitly requested for "puluh, ratus, ribu, juta".
    // This part can be expanded if sub-Rupiah precision in words is needed.
    return "Kurang dari satu Rupiah"
  }

  while (tempAmount > 0) {
    if (tempAmount % 1000 !== 0) {
      let chunkWords = convertThreeDigits(tempAmount % 1000)
      if (chunkIndex === 1 && tempAmount % 1000 === 1 && words === "") {
        // Handling "seribu"
        chunkWords = "seribu"
      } else if (ribuan[chunkIndex]) {
        chunkWords += chunkWords ? ` ${ribuan[chunkIndex]}` : ""
      }
      words = `${chunkWords} ${words}`
    }
    tempAmount = Math.floor(tempAmount / 1000)
    chunkIndex++
  }

  // Capitalize first letter and add Rupiah
  const finalWords = words.trim()
  if (!finalWords) return "N/A" // Should not happen if numericAmount > 0

  return finalWords.charAt(0).toUpperCase() + finalWords.slice(1) + " Rupiah"
}

// Helper function to format currency as IDR X.XXX.XXX (can also be in this util file)
export const formatCurrencyIDR = (
  amount: string | number | null | undefined
): string => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount
  if (
    numericAmount === null ||
    numericAmount === undefined ||
    isNaN(numericAmount)
  )
    return "N/A"
  return `IDR ${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount)}`
}
