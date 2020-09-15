var express = require ("express");
var router = express.Router();
var Campground=require("../models/camp");
var Antique=require("../models/antique");
var Pencil=require("../models/pencil");
var Comment=require("../models/comments");
var middleware=require("../middleware");
// if (process.env.NODE_ENV !== 'production') {
// 	require('dotenv').config()
//   }
  
// const stripeSecretKey = process.env.STRIPE_SECRET_KEY
// const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

// const fs = require('fs')
// const stripe = require('stripe')(stripeSecretKey)

router.get("/campgrounds",function(req,res){
Campground.find({}, function(err,campgrounds){
if(err){
console.log(err);
}else{ console.log()
res.render("campgrounds.ejs",{campgrounds:campgrounds, currentUser: req.user})
}
});
});


router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
		Campground.findById(req.params.id, function(err, foundcampground){
			res.render("edit.ejs", {campground: foundcampground});
	});
});

router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,ucamp){
		if(err)
			res.redirect("/campgrounds");
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});



router.get("/paintings/new",middleware.isLoggedIn,function(req,res){
res.render("news.ejs");
})



router.get("/paintings",function(req,res){
	Campground.find({}, function(err,campgrounds){
	if(err){
	console.log(err);
	}else{ console.log()
	res.render("paintings.ejs",{campgrounds:campgrounds, currentUser: req.user})
	}
	});
	});

	router.post("/paintings",middleware.isLoggedIn, function(req,res){
		var name = req.body.name;
		var image = req.body.image;
		var desc = req.body.description;
		var author={
			id: req.user._id,
			username: req.user.username
		}
		var newcampground = {name:name, image:image, description:desc, author:author }
		Campground.create(newcampground, function(err,newlycreated){
		if(err){
		console.log(err)
		}else{
		res.redirect("/paintings");
		}
		 });
		
		})

			
router.get("/campgrounds/:id",function(req,res){
Campground.findById(req.params.id).populate("comments").exec( function(err, foundcampground){
if(err){
console.log(err)
}else{
res.render("show.ejs",{campground: foundcampground, currentUser: req.user});
}
});
});

router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

router.get("/antiques/new",middleware.isLoggedIn,function(req,res){
    res.render("news2.ejs");
    })
    
    router.get("/antiques",function(req,res){
        Antique.find({}, function(err,campgrounds){
        if(err){
        console.log(err);
        }else{ console.log()
        res.render("antiques.ejs",{campgrounds:campgrounds, currentUser: req.user})
        }
        });
        });
    
        router.post("/antiques",middleware.isLoggedIn, function(req,res){
            var name = req.body.name;
            var price = req.body.price;
            var image = req.body.image;
            var desc = req.body.description;
            var author={
                id: req.user._id,
                username: req.user.username
            }
            var newcampground = {name:name, image:image,price:price, description:desc, author:author }
            Antique.create(newcampground, function(err,newlycreated){
            if(err){
            console.log(err)
            }else{
            res.redirect("/antiques");
            }
             });
            
			})
			
			router.get("/antiques/:id",function(req,res){
				Antique.findById(req.params.id).populate("comments").exec( function(err, foundcampground){
				if(err){
				console.log(err)
				}else{
					
				res.render("show2.ejs",{campground: foundcampground, currentUser: req.user});
				}
				});
				});

				router.get("/antiques/:id/edit",middleware.checkCampground2Ownership, function(req,res){
					Antique.findById(req.params.id, function(err, foundcampground){
						res.render("edit2.ejs", {campground: foundcampground});
				});
			});
			
			router.put("/antiques/:id", middleware.checkCampground2Ownership, function(req, res){
				Antique.findByIdAndUpdate(req.params.id, req.body.campground, function(err,ucamp){
					if(err)
						res.redirect("/antiques");
					else{
						res.redirect("/antiques/"+req.params.id);
					}
				});
			});

			router.delete("/antiques/:id", middleware.checkCampground2Ownership, function(req,res){
				Antique.findByIdAndRemove(req.params.id, function(err){
					if(err){
						console.log(err);
					}
					else{
						res.redirect("/antiques");
					}
				});
			});
		
			router.get("/pencil/new",middleware.isLoggedIn,function(req,res){
				res.render("news3.ejs");
				})
				
				router.get("/pencil",function(req,res){
					Pencil.find({}, function(err,campgrounds){
					if(err){
					console.log(err);
					}else{ console.log()
					res.render("pencil.ejs",{campgrounds:campgrounds, currentUser: req.user})
					}
					});
					});
				
					router.post("/pencil",middleware.isLoggedIn, function(req,res){
						var name = req.body.name;
						var price = req.body.price;
						var image = req.body.image;
						var desc = req.body.description;
						var author={
							id: req.user._id,
							username: req.user.username
						}
						var newcampground = {name:name, image:image,price:price, description:desc, author:author }
						Pencil.create(newcampground, function(err,newlycreated){
						if(err){
						console.log(err)
						}else{
						res.redirect("/pencil");
						}
						 });
						
						})
						
						router.get("/pencil/:id",function(req,res){
							Pencil.findById(req.params.id).populate("comments").exec( function(err, foundcampground){
							if(err){
							console.log(err)
							}else{
								// console.log(foundcampground);
							res.render("show3.ejs",{campground: foundcampground, currentUser: req.user});
							}
							});
							});
			
							router.get("/pencil/:id/edit",middleware.checkCampground3Ownership, function(req,res){
								Pencil.findById(req.params.id, function(err, foundcampground){
									res.render("edit3.ejs", {campground: foundcampground});
							});
						});
						
						router.put("/pencil/:id", middleware.checkCampground3Ownership, function(req, res){
							Pencil.findByIdAndUpdate(req.params.id, req.body.campground, function(err,ucamp){
								if(err)
									res.redirect("/pencil");
								else{
									res.redirect("/pencil/"+req.params.id);
								}
							});
						});
			
						router.delete("/pencil/:id", middleware.checkCampground3Ownership, function(req,res){
							Pencil.findByIdAndRemove(req.params.id, function(err){
								if(err){
									console.log(err);
								}
								else{
									res.redirect("/pencil");
								}
							});
						});
			
module.exports = router;