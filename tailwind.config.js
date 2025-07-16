
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'text-순수',
    'text-냉정',
    'text-광기',
    'text-활발',
    'text-우울',
    'bg-순수',
    'bg-냉정',
    'bg-광기',
    'bg-활발',
    'bg-우울',
    'border-순수',
    'border-냉정',
    'border-광기',
    'border-활발',
    'border-우울',
    'from-순수',
    'from-냉정',
    'from-광기',
    'from-활발',
    'from-우울',
    'to-순수/80',
    'to-냉정/80',
    'to-광기/80',
    'to-활발/80',
    'to-우울/80',
  ],
  theme: {
    extend: {
      colors: { // color가 아니다. colors로 입력할 것
        '순수': '#66c17c',
        '냉정': '#83b9eb',
        '광기': '#eb839a',
        '활발': '#ebdb83',
        '우울': '#c683ec',
      },
      keyframes: {
        slideDown: {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0px" },
        },
      },
      animation: {
        slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
}