import React from 'react'
import HTMLFlipBook from 'react-pageflip';
import wcCover from "../../../public/img/wc-cover.png"
import cov from "../../../public/img/wcWinners/1975.webp"

const Book = () => {
   const winnersData = [
  {
    year: "1975",
    winner: "West Indies",
    runnerUp: "Australia",
    host: "England",
    aboutfinal: "West Indies clinched the inaugural 1975 World Cup with a thrilling win over Australia at Lord’s, led by captain Clive Lloyd’s heroic century.",
    img: "../../../public/img/wcWinners/1975.webp"
  },
  {
    year: "1979",
    winner: "West Indies",
    runnerUp: "England",
    host: "England",
    aboutfinal: "The Caribbean giants defended their crown in 1979, with Viv Richards’ brilliance powering West Indies past England at Lord’s.",
    img: "../../../public/img/wcWinners/1979.webp"
  },
  {
    year: "1983",
    winner: "India",
    runnerUp: "West Indies",
    host: "England",
    aboutfinal: "India shocked the cricketing world in 1983, defeating the mighty West Indies under Kapil Dev’s captaincy, with his leadership becoming legendary.",
    img: "../../../public/img/wcWinners/1983.webp"
  },
  {
    year: "1987",
    winner: "Australia",
    runnerUp: "England",
    host: "India & Pakistan",
    aboutfinal: "Australia captured their maiden World Cup in 1987, edging past England in Kolkata under the cool leadership of Allan Border.",
    img: "../../../public/img/wcWinners/1987.webp"
  },
  {
    year: "1992",
    winner: "Pakistan",
    runnerUp: "England",
    host: "Australia & New Zealand",
    aboutfinal: "Pakistan lifted their first-ever World Cup in 1992, led by Imran Khan’s inspirational ‘cornered tigers’ spirit, defeating England at the MCG.",
    img: "../../../public/img/wcWinners/1992.webp"
  },
  {
    year: "1996",
    winner: "Sri Lanka",
    runnerUp: "Australia",
    host: "India, Pakistan & Sri Lanka",
    aboutfinal: "Sri Lanka stunned the cricketing world in 1996, defeating Australia in Lahore, with Arjuna Ranatunga leading his team to glory.",
    img: "../../../public/img/wcWinners/1996.webp"
  },
  {
    year: "1999",
    winner: "Australia",
    runnerUp: "Pakistan",
    host: "England",
    aboutfinal: "Australia began their golden era in 1999, thrashing Pakistan in the final at Lord’s, guided by captain Steve Waugh.",
    img: "../../../public/img/wcWinners/1999.webp"
  },
  {
    year: "2003",
    winner: "Australia",
    runnerUp: "India",
    host: "South Africa, Zimbabwe & Kenya",
    aboutfinal: "Australia crushed India in Johannesburg to win their third title, with Ricky Ponting’s blistering century sealing the 2003 final.",
    img: "../../../public/img/wcWinners/2003.webp"
  },
  {
    year: "2007",
    winner: "Australia",
    runnerUp: "Sri Lanka",
    host: "West Indies",
    aboutfinal: "Australia dominated once again in 2007, winning a third consecutive title under Ricky Ponting, defeating Sri Lanka in Barbados.",
    img: "../../../public/img/wcWinners/2007.webp"
  },
  {
    year: "2011",
    winner: "India",
    runnerUp: "Sri Lanka",
    host: "India, Sri Lanka & Bangladesh",
    aboutfinal: "India lifted the World Cup on home soil in 2011, with MS Dhoni’s iconic six in Mumbai sealing glory for his team.",
    img: "../../../public/img/wcWinners/2011.webp"
  },
  {
    year: "2015",
    winner: "Australia",
    runnerUp: "New Zealand",
    host: "Australia & New Zealand",
    aboutfinal: "Australia clinched their fifth World Cup in 2015, overpowering co-hosts New Zealand in Melbourne under Michael Clarke’s captaincy.",
    img: "../../../public/img/wcWinners/2015.webp"
  },
  {
    year: "2019",
    winner: "England",
    runnerUp: "New Zealand",
    host: "England & Wales",
    aboutfinal: "England won their maiden World Cup in 2019 after a dramatic Super Over against New Zealand at Lord’s, with captain Eoin Morgan lifting the trophy.",
    img: "../../../public/img/wcWinners/2019.webp"
  },
  {
    year: "2023",
    winner: "Australia",
    runnerUp: "India",
    host: "India",
    aboutfinal: "Australia triumphed in the 2023 World Cup final at Ahmedabad, overcoming India to claim their record sixth title under Pat Cummins’ captaincy.",
    img: "../../../public/img/wcWinners/2023.webp"
  }
];



  return (
  
         <HTMLFlipBook width={300} height={500} drawShadow={true} showCover={true} size='fixed' maxShadowOpacity={0.5} >
            <div>
                <img src={wcCover} alt="" />
            </div>
            <div className='w-full h-full bg-amber-400 flex flex-col items-center'>
                <div className='w-[80%] h-[40%] bg-red-400'>

                </div>
            </div>
        </HTMLFlipBook>

  )
}

export default Book