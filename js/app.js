
// Load  Dynamic Category Name from server api
const loadCategories = async () => {
    try {

        const res = await fetch(`https://openapi.programming-hero.com/api/news/categories`);
        const data = await res.json();
        displayCategories(data.data.news_category)
        
    } catch (error) {
        console.log(error.message)
    }
}

// Display Dynamic Category ON UI
const displayCategories = (categories) => {
    
   
    const newsCategories = document.getElementById("news-catagories");
    //const showCategory = document.getElementById("category-name");
    
    categories.forEach( (category) => {

       const categoryId = category.category_id;
      
        const divElement = document.createElement("div");
        divElement.classList.add("category-div")
        divElement.innerHTML = `
            <span class="active" onclick="loadCategoriesData('${categoryId}')">${category.category_name}</span>

        `
        newsCategories.appendChild(divElement);
    })
    
}

// Load Data for Dynamic Category from server api
const loadCategoriesData = async (id) => {  
    try {
        // start spinner while clicking on each new category
        toggleSpinner(true);
        const res = await fetch(`https://openapi.programming-hero.com/api/news/category/${id}`);
        const data = await res.json();
        displayCategoriesData(data.data);
    } catch (error) {
        console.log(error.message)
    }
}

// Display Data for Each Dynamic Category from server api through category_id
const displayCategoriesData = (posts) => {

    
    const showCategory = document.getElementById("category-name");
    const numberOfPost = document.getElementById("numberOfPost");

    // Display total number of post found for a category
    numberOfPost.textContent = posts.length;

    // Reassign the loaded post while clicking for new category post
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML = "";

    if(posts.length <= 0) {
        toggleSpinner(false);
        showCategory.innerText = " Culture";
    }

    // Sort the post by descending order | depend on larger number view 
    posts.sort( (a, b) => b.total_view - a.total_view);
 
    
    for(const post of posts) {
        
        const {thumbnail_url, title, details, total_view, _id} = post;
        const {img, name, published_date} = post.author;

        showCategory.innerText = ` Category Id : ${post.category_id}`;

        const singlePostDiv = document.createElement("div");
        singlePostDiv.classList.add("single-post-container");
        singlePostDiv.innerHTML = `
        
                    <div class="card mb-3">
                        <div class="row g-0 d-flex">
                          <div class="col-md-4 post-img">
                            <img src="${thumbnail_url}" class="" alt="...">
                          </div>
                          <div class="col-md-8">
                            <div class="card-body align-items-center py-4 my-4">

                              <div style="cursor:pointer" onclick="loadPostDetailData('${_id}')" data-bs-toggle="modal" data-bs-target="#postDetailModal">
                              
                              <h5 class="card-title">${title}</h5>
                              <p class="card-text">${details.slice(0, 250)}...</p>

                              </div>
                              <div class="post-bottom d-flex justify-content-between align-items-center pt-4">
                                <div class="post-author-info d-flex justify-content-center align-items-center gap-3">
                                    <img class="img-thumbnail" src="${img}" alt="">
                                    <div>
                                        <h5>${name ? name : "no name found"}</h5>
                                        <span>${published_date ? published_date : "No Date Found"}</span>
                                    </div>
                                    
                                </div>
    
                                <div class="total-views d-flex justify-content-center align-items-center gap-2">
                                    <i class="fa-regular fa-eye"></i>
                                    <h4>${total_view ? total_view : "No data found"}</h4>
                                </div>
    
                                <div class="detail-button">
                                   <button data-bs-toggle="modal" data-bs-target="#postDetailModal"  onclick="loadPostDetailData('${_id}')"> <i class="fa-solid fa-circle-info"></i></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
        
        `

        postContainer.appendChild(singlePostDiv);

        // stop Spinner
        toggleSpinner(false);
    }
    
}

// Load Data for single  post from category
const loadPostDetailData = async (news_id) => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/news/${news_id}`);
        const data = await res.json();
        displayPostDetailData(data.data[0])
    }catch(error) {
        console.log(error.message)
    }
}


// Display single post detail on modal
const displayPostDetailData = (post) => {

    const {thumbnail_url, title, details, total_view, category_id} = post;
    const {img, name, published_date} = post.author;
    
  
    const modalTitle = document.querySelector(".modal-title");
    modalTitle.innerHTML =  `Category Id: ${category_id ? category_id : "No category found"}`;


    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = `
        <div class="text-center"><img class="img-fluid mb-2" src="${thumbnail_url}"></div>
        <h4 class="card-title">Title: ${title ? title : "No title found"}</h4>
        <h5>Total Views: ${total_view ? total_view : "No Views Data Found"}</h5>
        <span>Author name: ${name ? name : "No Author Name Found"}</span>
    `
}


// Spinner Loading while Fetching data from server API
const toggleSpinner = isLoading => {
    const spinnerContainer = document.getElementById("spinner-container");
    isLoading ?  spinnerContainer.classList.remove("d-none") : spinnerContainer.classList.add("d-none");
}

// default loaded data for a first category named breaking news which category id is 01
loadCategoriesData("01")

// call the function for dynamic category loaded
loadCategories();




