$("#new-todo-form").submit(function(event) {
	event.preventDefault();
	var formData = $(this).serialize();

	$.post("/todos", formData, function(data) {
		$("#todo-list").append(
			`
				<li class="list-group-item">
					<form action="/todos/${data._id}" method="POST" class="edit-item-form">
						<div class="form-group">
							<label for="${data._id}">Item Text</label>
							<input id="${data._id}" type="text" value="${data.text}" name="todo[text]" class="form-control">
						</div>
						<button class="btn btn-primary">Update Item</button>
					</form>
					<span class="lead">
						${data.text}
					</span>
					<div class="pull-right">
						<button class="btn btn-sm btn-warning edit-button">Edit</button>
						<form class="delete-item-form" style="display: inline" method="POST" action="/todos/${data._id}?_method=DELETE">
							<button type="submit" class="btn btn-sm btn-danger">Delete</button>
						</form>
					</div>
					<div class="clearfix"></div>
				</li>

			`
		)
		$(".form-control").val("");
	});
});

$("#todo-list").on("click", ".edit-button", function() {
	$(this).parent().siblings(".edit-item-form").toggle(500);
});

$('#todo-list').on('submit', '.edit-item-form', function(e) {
	e.preventDefault();
	var toDoItem = $(this).serialize();
	var actionUrl = $(this).attr('action');
	$originalItem = $(this).parent('.list-group-item');
	$.ajax({
		url: actionUrl,
		data: toDoItem,
		type: 'PUT',
		originalItem: $originalItem,
		success: function(data) {
			this.originalItem.html(
				`
				<form action="/todos/${data._id}" method="POST" class="edit-item-form">
					<div class="form-group">
						<label for="${data._id}">Item Text</label>
						<input id="${data._id}" type="text" value="${data.text}" name="todo[text]" class="form-control">
					</div>
					<button class="btn btn-primary">Update Item</button>
				</form>
				<span class="lead">
					${data.text}
				</span>
				<div class="pull-right">
					<button class="btn btn-sm btn-warning edit-button">Edit</button>
					<form class="delete-item-form" style="display: inline" method="POST" action="/todos/${data._id}">
						<button type="submit" class="btn btn-sm btn-danger">Delete</button>
					</form>
				</div>
				<div class="clearfix"></div>
				`
			)
		}
	});
});

$("#todo-list").on("submit", ".delete-item-form", function(e) {
	e.preventDefault();
	var confirmResponse = confirm("Are you sure you want to delete?");
	if (confirmResponse) {
		var actionUrl = $(this).attr("action");
		var $itemToDelete = $(this).closest(".list-group-item");
		$.ajax ({
			url: actionUrl,
			type: "DELETE",
			itemToDelete: $itemToDelete,
			success: function(data) {
				this.itemToDelete.remove();
			}
		});
	}
	else {
		$(this).find("button").blur();
	}
});




















