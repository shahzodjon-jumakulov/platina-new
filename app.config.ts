export default defineAppConfig({
  ui: {
    primary: "indigo",
    container: {
      padding: "px-0 md:px-5 lg:px-8",
      constrained: "max-w-7xl mx-auto",
    },
    button: {
      base: "transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current",
      size: {
        sm: "text-xs leading-normal rounded",
        md: "text-xs leading-normal rounded-md",
        lg: "text-sm leading-[1.25rem] rounded-lg",
        xl: "text-base leading-snug rounded-lg",
      },
      padding: {
        sm: "px-2 py-1",
        md: "px-3 py-2",
        lg: "px-4 py-3",
        xl: "px-6 py-4",
      },
      color: {
        primary: {
          solid:
            "bg-light-blue hover:bg-[#005CB8] active:bg-[#0058AF] text-white",
          soft: "bg-light-blue-100 hover:bg-light-blue-200 active:bg-light-blue-300 focus-visible:bg-light-blue-300 text-light-blue",
        },
      },
    },
    divider: {
      border: {
        base: "border-light-blue-100 dark:border-light-blue-dark-100",
      },
    },
  },
});
