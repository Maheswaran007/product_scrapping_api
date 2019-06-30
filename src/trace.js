const cheerio = require('cheerio');
const axios = require('axios');
const asyncLib = require('async');

async function trace(request_params, no_try) {
    let response
    let url = request_params.url
    return new Promise(async (resolve, reject) =>{
      asyncLib.waterfall([
        async function(){
            console.log(`=== Going to ${request_params.url} ===`)
            return new Promise(async (res, rej) =>{
                try{
                    response = await axios.get(request_params.url);
                    console.log(response.status)
                    if (response.status === 200){
                        res()
                    }
                }
                catch(err){
                    console.log(err);
                    resolve({
                        'status_code':500,
                        'url': request_params.url,
                        'error': 'Failed to process request'
                    });
                }
            });
        },
        async function(){
            return new Promise(async(res, rej) =>{
                try{
                    const html = await response.data;
                    const $ = await cheerio.load(html);
                    let name = await $('h1[id="title"] > span').text().trim()
                    let description = await $('#feature-bullets').text().replace(/\s+/g," ").trim()
                    var list = []
                    await $(".a-button-text").find('img').each(function (index, element){
                        list.push($(element).attr('src'))
                    });
                    resolve({
                        'status_code':200,
                        'title': name,
                        'description': description,
                        'images': list
                    })
                }
                catch(err){
                    console.log(err);
                    resolve({
                        'status_code':500,
                        'url': request_params.url,
                        'error': 'Failed to process request'
                    });
                }
            })
        },
        async function(){}
      ])
    });
}
Tracer = {
    trace: trace
  };
  module.exports = Tracer;