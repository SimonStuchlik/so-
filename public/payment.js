import { db, collection, getDoc, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';
// Load cart items from local storage
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in header
const cartCountEl = document.querySelector('.cart-count');
cartCountEl.innerText = cartItems.length;

// Create table rows for cart items
const cartItemsEl = document.querySelector('#cart-items');
let totalCost = 0;
cartItems.forEach(item => {
  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  nameCell.innerText = item.name;
  row.appendChild(nameCell);

  const priceCell = document.createElement('td');
  priceCell.innerText = `${item.price} €`;
  row.appendChild(priceCell);

  const quantityCell = document.createElement('td');
  quantityCell.innerText = item.quantity;
  row.appendChild(quantityCell);

  const totalCell = document.createElement('td');
  const itemTotal = item.price * item.quantity;
  totalCell.innerText = `${itemTotal} €`;
  row.appendChild(totalCell);

  totalCost += itemTotal;

  cartItemsEl.appendChild(row);
});

// Add total cost row to table
const totalRow = document.createElement('tr');
totalRow.innerHTML = `
  <td colspan="3">Celková cena:</td>
  <td>${totalCost} €</td>
`;
cartItemsEl.appendChild(totalRow);

// Handle order form submission
const ordersCollection = collection(db, 'orders');
const orderForm = document.querySelector('#order-form');
orderForm.addEventListener('submit', event => {
  event.preventDefault();

  // Get form data
  const formData = new FormData(orderForm);
  const name = formData.get('name');
  const address = formData.get('address');
  const phone = formData.get('phone');
  const email = formData.get('email');

  // Create order object
  const order = {
    name,
    address,
    phone,
    email,
    items: cartItems,
    total: totalCost
  };

  let itemList = '';
  //for loop through cartItems to display items in email
  for (let i = 0; i < cartItems.length; i++) {
    itemList += `<li>${cartItems[i].name}</li>`;
  }

  // Send order to Firebase
  addDoc(ordersCollection, order)
    .then(() => {
      // Clear cart and redirect to thank you page
      Email.send({
        SecureToken : "0f4b8481-4031-4787-af23-5db13db767c5", //password 36DE7632C118CA400453D19A5C5B0EABEDBA
        To : email,
        From : "zilina.pilar@gmail.com",
        Subject : "This is the subject",
        Body : `<!DOCTYPE html>

        <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
        <title></title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
        <style>
            * {
              box-sizing: border-box;
            }
        
            body {
              margin: 0;
              padding: 0;
            }
        
            a[x-apple-data-detectors] {
              color: inherit !important;
              text-decoration: inherit !important;
            }
        
            #MessageViewBody a {
              color: inherit;
              text-decoration: none;
            }
        
            p {
              line-height: inherit
            }
        
            .desktop_hide,
            .desktop_hide table {
              mso-hide: all;
              display: none;
              max-height: 0px;
              overflow: hidden;
            }
        
            .image_block img+div {
              display: none;
            }
        
            @media (max-width:520px) {
              .desktop_hide table.icons-inner {
                display: inline-block !important;
              }
        
              .icons-inner {
                text-align: center;
              }
        
              .icons-inner td {
                margin: 0 auto;
              }
        
              .row-content {
                width: 100% !important;
              }
        
              .mobile_hide {
                display: none;
              }
        
              .stack .column {
                width: 100%;
                display: block;
              }
        
              .mobile_hide {
                min-height: 0;
                max-height: 0;
                max-width: 0;
                overflow: hidden;
                font-size: 0px;
              }
        
              .desktop_hide,
              .desktop_hide table {
                display: table !important;
                max-height: none !important;
              }
            }
          </style>
        </head>
        <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
        <tbody>
        <tr>
        <td class="column column-1" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad" style="width:100%;text-align:center;">
        <h1 style="margin: 0; color: #555555; font-size: 23px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 120%; text-align: center; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Objednávka prijatá</span></h1>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad">
        <div align="center" class="alignment">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span> </span></td>
        </tr>
        </table>
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td class="pad">
        <div style="color:#000000;font-size:14px;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
        <p style="margin: 0;">Meno a priezvisko: ${name}</p>
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad">
        <div align="center" class="alignment">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span> </span></td>
        </tr>
        </table>
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td class="pad">
        <div style="color:#000000;font-size:14px;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
        <p style="margin: 0;">Produkty:</p>
        </div>
        </td>
        </tr>
        </table><!--[if mso]><style>#list-r0c0m5 ul{margin: 0 !important; padding: 0 !important;} #list-r0c0m5 ul li{mso-special-format: bullet;}#list-r0c0m5 .levelOne li {margin-top: 0 !important;} #list-r0c0m5 .levelOne {margin-left: -20px !important;}#list-r0c0m5 .levelTwo li {margin-top: 0 !important;} #list-r0c0m5 .levelTwo {margin-left: 20px !important;}#list-r0c0m5 .levelThree li {margin-top: 0 !important;} #list-r0c0m5 .levelThree {margin-left: 60px !important;}#list-r0c0m5 .levelFour li {margin-top: 0 !important;} #list-r0c0m5 .levelFour {margin-left: 100px !important;}#list-r0c0m5 .levelFive li {margin-top: 0 !important;} #list-r0c0m5 .levelFive {margin-left: 140px !important;}#list-r0c0m5 .levelSix li {margin-top: 0 !important;} #list-r0c0m5 .levelSix {margin-left: 180px !important;}#list-r0c0m5 .levelSeven li {margin-top: 0 !important;} #list-r0c0m5 .levelSeven {margin-left: 220px !important;}#list-r0c0m5 .levelEight li {margin-top: 0 !important;} #list-r0c0m5 .levelEight {margin-left: 260px !important;}</style><![endif]-->
        <table border="0" cellpadding="10" cellspacing="0" class="list_block block-6" id="list-r0c0m5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td class="pad">
        <div class="levelOne" style="margin-left: 0;">
        <ul class="leftList" style="margin-top: 0; margin-bottom: 0; padding: 0; padding-left: 20px; font-weight: 400; text-align: left; color: #000000; font-size: 14px; font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; line-height: 120%; direction: ltr; letter-spacing: 0; list-style-type: disc;">
        <li style="margin-bottom: 0; text-align: left;">${itemList}</li>
        </ul>
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad">
        <div align="center" class="alignment">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span> </span></td>
        </tr>
        </table>
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td class="pad">
        <div style="color:#000000;font-size:14px;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
        <p style="margin: 0;">Celková cena: ${totalCost}€</p>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
        <tbody>
        <tr>
        <td class="column column-1" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
        <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
        <!--[if !vml]><!-->
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table><!-- End -->
        </body>
        </html>`
    }).then(
      message => alert(message)
    );
      localStorage.removeItem('cart');
      // window.location.href = './thankyou.html';
    })
    .catch(error => {
      console.error(error);
      alert('Chyba pri odosielaní objednávky.');
    });
});
