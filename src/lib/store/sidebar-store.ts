import { create } from "zustand";

export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarState = {
  state: "expanded" | "collapsed";
  open: boolean;
  openMobile: boolean;
  isMobile: boolean;
  setOpen: (open: boolean) => void;
  setOpenMobile: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  toggleSidebar: () => void;
};

export const useSidebarStore = create<SidebarState>()((set, get) => {
  // Add keyboard event listener when the store is initialized
  if (typeof window !== "undefined") {
    // Check for mobile on initialization
    const checkIsMobile = () => window.innerWidth < 768;

    window.addEventListener("keydown", (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        const { isMobile } = get();
        if (isMobile) {
          set((state) => ({ openMobile: !state.openMobile }));
        } else {
          set((state) => ({
            open: !state.open,
            state: !state.open ? "expanded" : "collapsed",
          }));
        }
      }
    });

    // Set up resize listener to update isMobile state
    window.addEventListener("resize", () => {
      set({ isMobile: checkIsMobile() });
    });
  }

  return {
    state: "expanded",
    open: true, // Default state
    openMobile: false,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 768 : false,
    setOpen: (open: boolean) =>
      set({
        open,
        state: open ? "expanded" : "collapsed",
      }),
    setOpenMobile: (openMobile: boolean) => set({ openMobile }),
    setIsMobile: (isMobile: boolean) => set({ isMobile }),
    toggleSidebar: () => {
      const { isMobile } = get();
      if (isMobile) {
        set((state) => ({ openMobile: !state.openMobile }));
      } else {
        set((state) => ({
          open: !state.open,
          state: !state.open ? "expanded" : "collapsed",
        }));
      }
    },
  };
});
