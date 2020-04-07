var express = require ("express");
var router = express.Router({mergeParams: true});
var Campground=require("../models/camp");
var Comment=require("../models/comments");
var Antique=require("../models/antique");
var Pencil=require("../models/pencil");
var passport = require("passport");
var User = require("../models/user");
var middleware=require("../middleware");


router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){    
Campground.findById(req.params.id, function(err,campground){
if(err){
console.log(err);
}else{
res.render("new.ejs" , {campground:campground, currentUser: req.user});
}

   });
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
Campground.findById(req.params.id,function(err ,campground){
if(err){
console.log(err);
res.redirect("/campgrounds")
}else{
Comment.create(req.body.comment, function(err,comment){
if(err){
console.log(err);
}else{
comment.author.id =  req.user._id;
comment.author.username = req.user.username;
comment.save();
campground.comments.push(comment);
campground.save();
req.flash("success", "Successfully added comment");
res.redirect("/campgrounds/"+campground._id)
}
})
}
});
});


router.get("/antiques/:id/comments/new", middleware.isLoggedIn, function(req,res){    
	Antique.findById(req.params.id, function(err,campground){
	if(err){
	console.log(err);
	}else{
	res.render("new2.ejs" , {campground:campground, currentUser: req.user});
	}
	
	   });
	});
	
	router.post("/antiques/:id/comments", middleware.isLoggedIn, function(req,res){
	Antique.findById(req.params.id,function(err ,campground){
	if(err){
	console.log(err);
	res.redirect("/antiques")
	}else{
	Comment.create(req.body.comment, function(err,comment){
	if(err){
	console.log(err);
	}else{
	comment.author.id =  req.user._id;
	comment.author.username = req.user.username;
	comment.save();
	campground.comments.push(comment);
	campground.save();
	req.flash("success", "Successfully added comment");
	res.redirect("/antiques/"+campground._id)
	}
	})
	}
	});
	});
	
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundcomment){
		if(err)
			res.redirect("back");
		else
			res.render("editcomments.ejs", {camp_id: req.params.id, comment: foundcomment});
	});
	
});

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,ucom){
		if(err)
			res.redirect("back");
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
})

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err,ucom){
		if(err)
			res.redirect("back");
		else{
			req.flash("success", "Deleted successfully")
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
})

router.get("/antiques/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundcomment){
		if(err)
			res.redirect("back");
		else
			res.render("editcomments2.ejs", {camp_id: req.params.id, comment: foundcomment});
	});
	
});

router.put("/antiques/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,ucom){
		if(err)
			res.redirect("back");
		else{
			res.redirect("/antiques/"+req.params.id);
		}
	});
})

router.delete("/antiques/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err,ucom){
		if(err)
			res.redirect("back");
		else{
			req.flash("success", "Deleted successfully")
			res.redirect("/antiques/"+req.params.id);
		}
	});
})

router.get("/pencil/:id/comments/new", middleware.isLoggedIn, function(req,res){    
	Pencil.findById(req.params.id, function(err,campground){
	if(err){
	console.log(err);
	}else{
	res.render("new3.ejs" , {campground:campground, currentUser: req.user});
	}
	
	   });
	});
	
	router.post("/pencil/:id/comments", middleware.isLoggedIn, function(req,res){
	Pencil.findById(req.params.id,function(err ,campground){
	if(err){
	console.log(err);
	res.redirect("/pencil")
	}else{
	Comment.create(req.body.comment, function(err,comment){
	if(err){
	console.log(err);
	}else{
	comment.author.id =  req.user._id;
	comment.author.username = req.user.username;
	comment.save();
	campground.comments.push(comment);
	campground.save();
	req.flash("success", "Successfully added comment");
	res.redirect("/pencil/"+campground._id)
	}
	})
	}
	});
	});
	
	router.get("/pencil/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
		Comment.findById(req.params.comment_id, function(err, foundcomment){
			if(err)
				res.redirect("back");
			else
				res.render("editcomments3.ejs", {camp_id: req.params.id, comment: foundcomment});
		});
		
	});
	
	router.put("/pencil/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,ucom){
			if(err)
				res.redirect("back");
			else{
				res.redirect("/pencil/"+req.params.id);
			}
		});
	})
	
	router.delete("/pencil/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
		Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err,ucom){
			if(err)
				res.redirect("back");
			else{
				req.flash("success", "Deleted successfully")
				res.redirect("/pencil/"+req.params.id);
			}
		});
	})
	

module.exports = router;

