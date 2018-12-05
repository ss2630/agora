# Agora
Web application 
AGORA
Overview
Agora, derived from the Greek word for a public gathering place or marketplace, aims to create a forum in which college students can buy, sell, or rent any school supplies or textbooks they may have or need. 
	The application will allow students to enter the website using their unique school ID, create an account, and then fulfill their need. The goal is to build this application and utilize Rutgers University as a testing ground / incubator, then expand to colleges and universities across the nation.

Motivation / Target Audiences
The main motivation for Agora to operate is creating an active market for students can directly buy,sell or rent any products to each others on campus without going through third parties. Agora offers highly competitive prices compare to Amazon because it mainly focuses on student needs in a timely manner. In a student’s perspectives, we mostly ordered books or supplies from Amazon and have to pay for shipping costs plus need to wait for couple days before actually receive the products. We think that why don’t we create a market inside our community. By that chance, we don’t need to pay for shipping and get the products instantly because we can benefit as a current student. We can exchange or deliver products within a day and it doesn’t take too much time for the buyers to send the products whether the sellers to receive the products. 
Agora Functionalities and Constraints 
	Agora will function as a system that allows for student users to create an account, upload information about the products / books they would like to sell / rent out using either an ISBN or a UPC, or search through the products / books available using the same system. All in all, it is a way to connect buyers to sellers and to create a working system, not go much further. 
Users will begin by logging in or creating an account and be led to a screen with two buttons, where they will choose to “Buy” or “Sell.” Once they pick an option, a drop down menu box will ask whether they are looking for a Textbook / Notes or  Products. Once an option is selected, they can input the ISBN or Product UPC respectively to search for the item. Next, a list of results will be pulled from the existing databases, displaying the product ISBN’s, names, seller ID’s, and whether notes are included with the textbook, the rental price, and the buy-out price. If, on the other hand, the individual would like to sell their textbook, they will be asked to enter the information about their Textbook / Product, including the ISBN / UPC, desired buy-out price, desired rental price, and any additional detail they would like to add. 
	In its initial phase, Agora will lack the functionality to link to a payment system, such as Venmo or Paypal. It will also lack the ability to connect to USPS and other delivery methods, as we intend for it to stay within a campus model. We also would like to create a “notification” system to alert buyers as to whether their desired Textbook / Product is available and to alert the sellers that their item has been bought. However, we believe that functionality would require us to create an email account linked to the product website (i.e. helpdesk@agora.com). As a result, this functionality may not be available. 

Commercialization / Business Model
	We believe that Agora has a sustainable competitive advantage in that it offers a differentiated product: textbooks bundled with notes from students who have taken the class at the same university in the past. Moreover, the main competitors of Agora (i.e. Amazon) compete based on convenience. Amazon isn’t always the cheapest option -- but it offers a system of one-day delivery that many students find convenient. With Agora, delivery options are arranged between the students who are buying and selling the item. If the student buying your textbook is at your university on the same campus, you can arrange a free pick-up / drop-off. All in all, Agora’s sustainable competitive advantage will depend on differentiation, convenience, and likely, price.
Once the app is running smoothly, we would like it to become the one-stop-shop for any and all university-related marketplace needs. For example, subletting of off-campus apartments, textbook and note rentals / purchases, school supplies, and more. Currently, there are a multitude of different websites all offering different components. Our offering here would again be convenience and ease.  
In order to generate revenue, the website will take a percentage of every sale or rental made on the website. We can also include room for advertisements by different organizations (likely linked to the school) to generate additional revenue. Finally, we can sell user data to interested parties; seeing as our site can be used to sell additional resources / textbooks, the university or bookstores in the area may be interested to know which are the most popular purchases among students. 
	The costs associated with the website will be derived from buying the domain name (a fixed cost), and as the marketplace expands, other utilities (variable expenses) such as revenues shared with the payment system used (e.g. Paypal, Venmo), and other relevant parties (e.g. USPS and other shipping companies). We can’t think

Will authentication be include? What kind?
We have username and password authentication for each account. User registration is linked with Rutgers’ netid. Also, each buying and selling includes identification for the product. Customer can enter the ISBN/UPC of the book/product and price they want to charge for renting purpose or selling purpose. Product quality can be ensured as buyer and seller meet up for a pick up on campus, we also have image section for the books/products.

ER-diagram
 

Three main tables: 
•	Book table: 
o	Unique key: book_id
o	includes book info such as ISBN, sell price, rent price, picture
•	Customer table:   
o	Unique key: RUID
o	User basic info:   Name, address 
o	Stores store buyer & seller information 

•	Transaction table:  
o	Unique key: transaction_id
o	contains seller, buyer id, book id
•	Order Table:  search for orders can retrieve all the relevant information
o	unique key: Order_id 
o	Other attributes includes price, date, picture of item


 


