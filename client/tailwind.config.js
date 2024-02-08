export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        'accent':'#EAC74F',
        'accent-light' : '#F9E197',

        'background':'#F8F6F5',
        "text-accent":"#3F3D56"
      },
      fontFamily:{
        'display':['Staatliches']
      }
      
    },
  },
  plugins: [],
}