const cheerio = require('cheerio');
const axios = require('axios');
const express = require("express");

const port = express();
const cors = require("cors");

port.use(cors())
port.use(express.json())

port.get("/",(req,res)=>{
  res.json("working")
})

port.post("/flipkart",async function (req,res){
axios.get(req.body.url).then((response) => {
  let result = []
  const $ = cheerio.load(response.data)
  const urlElems = $('div._2kHMtA')
  for (let i = 0; i < urlElems.length; i++) {
    const title = $(urlElems[i]).find('div._4rR01T')
    const rating = $(urlElems[i]).find('div._3LWZlK')
    const fprice = $(urlElems[i]).find('div._30jeq3')
    const aprice = $(urlElems[i]).find('div._3I9_wc')
    const image = $(urlElems[i]).find('div.CXW8mj > img._396cs4')
    if (title) {
      const urlText = $(title).text()
      var fdata = {"image": $(image).attr('src'),urlText,"rating":$(rating).text(),"aprice":$(aprice).text(),"fprice":$(fprice).text()}
      result.push(fdata)
    }
  }
  res.json(result)
})})

port.post("/amazon",async function (req,res){
  axios.get(req.body.url).then((response) => {
    let result = []
    const $ = cheerio.load(response.data)
    const urlElems = $('div.s-result-item')
    for (let i = 0; i < urlElems.length; i++) {
      const title = $(urlElems[i]).find('span.a-text-normal')
      const rating = $(urlElems[i]).find('span.a-icon-alt')
      const fprice = $(urlElems[i]).find('span.a-offscreen')
      const aprice = $(urlElems[i]).find('span.a-offscreen')
      const image = $(urlElems[i]).find('div.s-image-fixed-height > img')
      if (title) {
        const urlText = $(image).attr('alt')
        const img = $(image).attr('src')
        const rate = $(rating).text()
        const fp = $(fprice[0]).text()
        const ap = $(aprice[1]).text()
        const fdata = {"image": img,urlText,"rating":rate,"aprice":ap,"fprice":fp}
        if(fdata.image)
        result.push(fdata)
      }
    }
    res.json(result)
  })})

port.listen(process.env.PORT || 8080,()=>{console.log("server is running")})
