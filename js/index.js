getProductList();

// all function statement
async function hideAllSection() {
  let plsElement = document.getElementById("product-list-section");
  let aepsElement = document.getElementById("add-edit-product-section");
  let saveBtnElement = document.getElementById("save-btn");
  let updateBtnElement = document.getElementById("update-btn");
  plsElement.style.display = "none";
  aepsElement.style.display = "none";
  saveBtnElement.style.display = "none";
  updateBtnElement.style.display = "none";
}

async function showSection(idName) {
  let element = document.getElementById(idName);
  element.style.display = "block";
}

async function showBtn(idName) {
  let element = document.getElementById(idName);
  element.style.display = "inline";
}

async function hideSection(idName) {
  let element = document.getElementById(idName);
  element.style.display = "none";
}

async function getProductDetailsById(productId) {
  let response = axios.get(
    `https://crud.teamrabbil.com/api/v1/ReadProductById/${productId}`
  );
  return response;
}

async function getProductList() {
  await hideAllSection();
  await showSection("product-list-section");
  let response = await axios.get(
    "https://crud.teamrabbil.com/api/v1/ReadProduct"
  );
  if (response.status === 200) {
    let productLists = response.data.data;
    console.log("productLists: ", productLists);
    let output = await makeTableForProduct(productLists);
    document.getElementById("product-list-table").innerHTML = output;
  } else {
    alert(response.statusText);
  }
}

async function makeTableForProduct(productLists) {
  let output = "";
  let sl = 1;
  productLists.forEach((product) => {
    output += `
              <tr>
                  <td>${sl++}</td>
                  <td class="text-center">${product.ProductCode}</td>
                  <td>${product.ProductName}</td>
                  <td class="text-center">
                      <img src="${product.Img}" width="50" height="50"</img>
                  </td>
                  <td class="text-end">${product.UnitPrice}</td>
                  <td class="text-end">${product.Qty}</td>
                  <td class="text-end">${product.TotalPrice}</td>
                  <td class="text-center">
                    <div class="d-flex">
                      <div class="mx-1">
                        <button class="btn btn-success btn-sm mb-1" onclick="editProduct('${
                          product._id
                        }')">Edit</button>
                      </div>
                      <div>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${
                          product._id
                        }')">Delete</button>
                      </div>
                    </div>
                  </td>
              </tr>
            `;
  });
  return output;
}

function makeFormObject() {
  let productId = document.getElementById("productId").value;
  let productCode = document.getElementById("productCode").value;
  let productName = document.getElementById("productName").value;
  let productImage = document.getElementById("productImage").value;
  let unitPrice = document.getElementById("unitPrice").value;
  let qty = document.getElementById("qty").value;
  let totalPrice = document.getElementById("totalPrice").value;
  let formObject = {
    Img: productImage,
    ProductCode: productCode,
    ProductName: productName,
    Qty: qty,
    TotalPrice: totalPrice,
    UnitPrice: unitPrice,
  };
  return formObject;
}

function emptyFormData(productDetails) {
  document.getElementById("productId").value = "";
  document.getElementById("productCode").value = "";
  document.getElementById("productName").value = "";
  document.getElementById("productImage").value = "";
  document.getElementById("unitPrice").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("totalPrice").value = "";
}

function fillUpFormData(productDetails) {
  document.getElementById("productId").value = productDetails._id;
  document.getElementById("productCode").value = productDetails.ProductCode;
  document.getElementById("productName").value = productDetails.ProductName;
  document.getElementById("productImage").value = productDetails.Img;
  document.getElementById("unitPrice").value = productDetails.UnitPrice;
  document.getElementById("qty").value = productDetails.Qty;
  document.getElementById("totalPrice").value = productDetails.TotalPrice;
}

async function calculateTotalPrice() {
  let uniPrice = document.getElementById("unitPrice").value;
  let qty = document.getElementById("qty").value;
  if (uniPrice === "" || uniPrice <= 0) {
    uniPrice = 1;
    document.getElementById("unitPrice").value = unitPrice;
  }
  if (qty === "" || qty <= 0) {
    qty = 1;
    document.getElementById("qty").value = qty;
  }
  let totalPrice = uniPrice * qty;
  document.getElementById("totalPrice").value = totalPrice.toFixed(2);
}

async function addProduct() {
  await hideAllSection();
  await showBtn("save-btn");
  await showSection("add-edit-product-section");
}

async function saveProduct() {
  let createObject = await makeFormObject();
  console.log("createObject: ", createObject);
  let response = await axios.post(
    `https://crud.teamrabbil.com/api/v1/CreateProduct`,
    createObject
  );

  if (response.status === 200) {
    alert("Product saved successfully");
    await emptyFormData();
    await getProductList();
  } else {
    alert("Product saved failed");
  }
}

async function editProduct(productId) {
  let response = await getProductDetailsById(productId);
  if (response.status === 200) {
    await hideAllSection();
    let productDetails = response.data.data[0];
    console.log("productDetails", productDetails);
    await fillUpFormData(productDetails);
    await showBtn("update-btn");
    await showSection("add-edit-product-section");
  } else {
    alert("Product not found");
  }
}

async function updateProduct() {
  let productId = document.getElementById("productId").value;
  let updateObject = await makeFormObject();
  let response = await axios.post(
    `https://crud.teamrabbil.com/api/v1/UpdateProduct/${productId}`,
    updateObject
  );

  if (response.status === 200) {
    alert("Product updated successfully");
    await emptyFormData();
    await getProductList();
  } else {
    alert("Product updated failed");
  }
}

async function deleteProduct(productId) {
  console.log("productId: ", productId);
  let response = await axios.get(
    `https://crud.teamrabbil.com/api/v1/DeleteProduct/${productId}`
  );

  if (response.status === 200) {
    await getProductList();
    alert("Product deleted successfully.");
  } else {
    alert("Product delete failed");
  }
}
