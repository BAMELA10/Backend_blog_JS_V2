The same backend of the blog but this time, we will add the complete Error handling module for manage efficacy all type of request and give the appropriate response

Entities for this apppication :

User : id, Username, First name, Last name, Email, Role, password,
Post : id; Title, Content, Image, Author, DateOfCreation,
Comment : id, Content, DateOfCreation, Author, Post


Pour la Securité mon je vais mettre en place:
-- Mise en place du protocole HTTPS
-- Systeme D'authentification des Application avec une API_KEY
-- Limitation de Requète
-- logging(jornalisation)

Pour la performance et La Scalabilité:
-Pagination
-Caching

Documentation avec Swagger:

fonction à tester pour validation du tri et du filtre

-GetAllUser
?sort=att&desc=att  ok
?page=num&limit=num

-FilterUser
?email=,firstname=,role=,lastname=,sort=att&desc=att  ok
?page=num&limit=num

-FilterComment,
?userId=&postId=&id=&sort="desc" ok
?page=num&limit=num

-GetAllComments,
?sort="asc"        ok
?page=num&limit=num 

-GetAllPost
?sort=att&desc=att ok
?page=num&limit=num

-FilteringPost
?title=title&author=author ok
?page=num&limit=num

