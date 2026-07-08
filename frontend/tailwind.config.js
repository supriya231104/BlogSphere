/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", // src folder ke saare files
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      screens: {
        maxsixhundread: { max: '600px' },
        maxeighthun: { max: '800px' },
        maxfourfifty: { max: '450px' },
        midbreakpoint:{max:'1007px',min:'601px'},
        maxlg:{max:'1024px'},
        maxninehundread:{max:'900px'}

       
        
      }

    },
  },
  plugins: [],
}