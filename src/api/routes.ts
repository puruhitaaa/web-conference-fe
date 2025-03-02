import { apiConfig } from "./config";

// Public routes (readable by everyone, writable by logged-in users)
// export const publicRoutes = {
//     papers: `${apiConfig.baseUrl}/664/papers`,
// }

// Protected routes (readable and writable only by logged-in users)
export const protectedRoutes = {
    // User profile and settings
    users: `${apiConfig.baseUrl}/660/users`,
    profile: `${apiConfig.baseUrl}/660/users/profile`,
    
    // Conference submissions
    submissions: `${apiConfig.baseUrl}/640/papers/submissions`,
    
    // LoA routes (owned resources)
    loas: `${apiConfig.baseUrl}/600/loas`,
    loaHistory: `${apiConfig.baseUrl}/600/loas/history`,
    
    // Payment routes (owned resources)
    invoices: `${apiConfig.baseUrl}/600/invoices`,
    receipts: `${apiConfig.baseUrl}/600/receipts`,
    payments: `${apiConfig.baseUrl}/600/payments`,
    
    // History routes (owned resources)
    history: {
        icodsa: {
            loa: `${apiConfig.baseUrl}/600/history/icodsa/loa`,
            invoice: `${apiConfig.baseUrl}/600/history/icodsa/invoice`,
            receipt: `${apiConfig.baseUrl}/600/history/icodsa/receipt`
        },
        icicyta: {
            loa: `${apiConfig.baseUrl}/600/history/icicyta/loa`,
            invoice: `${apiConfig.baseUrl}/600/history/icicyta/invoice`,
            receipt: `${apiConfig.baseUrl}/600/history/icicyta/receipt`
        }
    }
}

// Read-only routes (no write access, but readable by everyone)
export const readOnlyRoutes = {
    conferenceInfo: `${apiConfig.baseUrl}/444/conferences/info`,
    guidelines: `${apiConfig.baseUrl}/444/guidelines`,
}

// Admin routes (special routes for admin access)
export const adminRoutes = {
    dashboard: `${apiConfig.baseUrl}/600/dashboard`,
    manage: {
        users: `${apiConfig.baseUrl}/600/users`,
        papers: `${apiConfig.baseUrl}/600/papers`,
        payments: `${apiConfig.baseUrl}/600/payments`,
        conferences: `${apiConfig.baseUrl}/600/conferences`
    }
}

// Utility function to construct URLs with parameters
export const constructUrl = (baseUrl: string, params: Record<string, string>) => {
    const url = new URL(baseUrl, window.location.origin)
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
    })
    return url.toString()
}