let URL = "https://fakestoreapi.com/products";

let Model = {
  data: [],
  searthText: '',
  sortDirection: null,
  sortFromAndTo: null,

  async request() {
    let data = await fetch(URL);
    data = await data.json();
    this.data = data;
    this.render();
    console.log('request READY', data);
  }, //request()

  render() {
    
    let tagApps = document.querySelector(".apps");
    let output = [...this.data];
    if (this.sortFromAndTo) {
      output = output.filter((item) =>item.price >= this.sortFromAndTo[0]&& item.price <= this.sortFromAndTo[1])
    }
    if(this.searthText){
      output = output.filter(i=> `${i.title + ' ' + i.price +' ' + i.category +' ' + i.description}`
                                  .toLowerCase()
                                  .includes(this.searthText));
    }
    if (this.sortDirection == 'up') {
      console.log(this.sortDirection);
      output.sort((a,b)=> a.price - b.price);
    }
    if (this.sortDirection == 'down') {
      output.sort((a,b)=> b.price - a.price);
    }
    tagApps.innerHTML = output.map( item =>`
        <div>
        <div class="tag card my-2 d-flex  column justify-content-center" >
          <div class='imgStyle '>
            <img src="${item.image}" class="p-3 card-img-top  text-center" alt="...">
          </div>
          <div class="card-body ">
            <h5 class="text-center">${item.title}</h5>
            <p class='text-center '>${item.description}</p>
          </div> 
          <div class="pe-4">
            <h5 class='price text-end '>$ ${item.price}</h5>
          </div>
        </div>
        </div>
        `
      ).join('');
  },//render()

  searth(stext){
    this.searthText = stext.toLowerCase().trim()
    this.render();
    console.log(this.searthText);
  },//sort()

  sort(dir){
    this.sortDirection = dir;
    this.render();
  },//sort()
  sortFrom(of,to){
    this.sortFromAndTo = [of,to];
    this.render();
  }


};
/************************************/
let searchInput = document.getElementById('search');
searchInput.addEventListener('input', function(){
    Model.searth(searchInput.value);
})
/***********************************/
let sortUp = document.getElementById('sort-up');
let sortDown = document.getElementById('sort-down');

sortUp.addEventListener('click',function(){
  Model.sort('up');
})
sortDown.addEventListener('click',function(){
  Model.sort('down');
})
/******************************************/

const rangeInput = document.querySelectorAll(".range-input input"),
priceInput = document.querySelectorAll(".price-input input"),
range = document.querySelector(".slider .progress");
let priceGap = 1;

priceInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value);
        Model.sortFrom(minPrice,maxPrice);
        if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
            if(e.target.className === "input-min"){
                rangeInput[0].value = minPrice;
                
                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
            }else{
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);
        Model.sortFrom(minVal,maxVal);
        
        if((maxVal - minVal) < priceGap){
            if(e.target.className === "range-min"){
                rangeInput[0].value = maxVal - priceGap
            }else{
                rangeInput[1].value = minVal + priceGap;
            }
        }else{
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    });
});


Model.request();
