var middlewareobj={};
var Campground=require("../models/camp");
var Comment=require("../models/comments");
var Antique=require("../models/antique");
var Pencil=require("../models/pencil");

middlewareobj.checkCampgroundOwnership=function(req, res, next){
if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundcampground){
		if(err)
			res.redirect("back");
		else{
			if(foundcampground.author.id.equals(req.user._id)){
				next();
			}
			else{
				res.redirect("back");
			}
		}
	});
	}
	else{
		req.flash("error", "You need to login first");
		res.redirect("back");
	}	
}

middlewareobj.checkCampground2Ownership=function(req, res, next){
	if(req.isAuthenticated()){
			Antique.findById(req.params.id, function(err, foundcampground){
			if(err)
				res.redirect("back");
			else{
				if(foundcampground.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back");
				}
			}
		});
		}
		else{
			req.flash("error", "You need to login first");
			res.redirect("back");
		}	
	}
	
	middlewareobj.checkCampground3Ownership=function(req, res, next){
		if(req.isAuthenticated()){
				Pencil.findById(req.params.id, function(err, foundcampground){
				if(err)
					res.redirect("back");
				else{
					if(foundcampground.author.id.equals(req.user._id)){
						next();
					}
					else{
						res.redirect("back");
					}
				}
			});
			}
			else{
				req.flash("error", "You need to login first");
				res.redirect("back");
			}	
		}
		
middlewareobj.checkCommentOwnership=function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundcomment){
		if(err)
			res.redirect("back");
		else{
			if(foundcomment.author.id.equals(req.user._id)){
				next();
			}
			else{
				res.redirect("back");
			}
		}
	});
	}
	else{
		res.redirect("back");
	}	
}

middlewareobj.isLoggedIn=function(req, res, next){

	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first!");
	res.redirect("/login");
}



module.exports=middlewareobj;
