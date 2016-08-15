console.log("Hello from main.js")

$(".tasks").on("click", function(e) {
	e.preventDefault();
	console.log(this);
	var url = $(this).attr("href");
	
	var $self = $(this);

	$( ".alertRemove" ).html( "<div class='alert alert-danger' role='alert'>Task  Was Removed</div>" );

	$.ajax({
		url: url,
		type: 'delete'
	})
	.done(function(msg) {
		$self.parent().remove();
	})
})

$(".completed").on("click", function(e) {
	e.preventDefault();
	console.log(this);
	var url = $(this).attr("href");
	console.log(url);
	

		// if(url==='/tasks'){
		//    $( ".alertRemove" ).html( "<div class='alert alert-success' role='alert'><strong>All Tasks</strong> Was Completed</div>" );
	 //    }else{
		//    $( ".alertRemove" ).html( "<div class='alert alert-info' role='alert'><strong>One Task</strong> Was Completed</div>" );
	 //    }

	$.ajax({
		url: url,
		type: 'put'
	})
	.done(function(msg) {
		window.location = '/tasks';
	})

})