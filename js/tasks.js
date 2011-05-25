// Task List: "+ task" AND "- task" Button Initializer
function init_add_remove_task_buttons(){
	$(".task-section").children(".button").each(function(){
		var button = $(this);
		button.bind('click', function(){
			// Dangerous... assumes a certain div structure!
			var section = $(this).parent().attr('id');
			var action = $(this).attr('action');
			// 1. TASK LIST "+ task" Button Actions
			if(action=='add'){
				// 1. Append task at the bottom of the list...
				if(section=='your-tasks'){
					$("#your-tasks").find(".task-list").append(create_task(null, 'your-tasks', 0));
				} else if(section=='shared-tasks'){
					$("#shared-tasks").find(".task-list").append(create_task(null, 'shared-tasks', 1));
				}
				// 2. Find the new task...
				var new_task;
				$("#" + section).find(".task-list").find("li").each(function(){
					if($(this).attr('new')){
						new_task = $(this);
						$(this).removeAttr('new');
					}
				});
				// 3. Initialize task...
				if(section=='your-tasks'){
					init_tasks(new_task);
				} else if(section=='shared-tasks'){
					init_tasks(new_task);
				}
				// 4. Select the task content for editing
				new_task.find(".task-content").focus();
			}
			// 2. TASK LIST "- task" Button Actions:
			if(action=='remove'){
				if($(this).attr('value')=='off'){
					// 1. Turn the button style to ON
					$(this).attr('value', 'on');
					// 2. Show the task remove buttons
					$("#" + section).find(".task-bar").each(function(){
						$(this).find(".remove-task").show();
					});
				}
				else if($(this).attr('value')=='on'){
					// 1. Turn the button 'off'
					$(this).attr('value', 'off');
					// 2. Hide the remove buttons
					$("#" + section).find(".task-bar").each(function(){
						$(this).find(".remove-task").hide();
					});
				}
			}
		});
	});
}

// Master Task Initializer
function init_tasks(task){
	/*
		1. Checks to see where the TASK is by id of parent().parent()
		2. If in your-tasks, initializes accordingly
		3. If in shared-tasks, initializes accordingly
	*/
	// 1. Check to see where the TASK is
	var section = task.parent().parent().attr('id');
	// 2. If TASK is in 'your-tasks'...
	if(section=='your-tasks'){
		add_debug(section);
		// 3. Initialize checkboxes
		init_checkboxes(task.find(".checkbox"));
	}
	// 3. If TASK is in 'shared-tasks'...
	if(task.parent().parent().attr('type', 'shared')){
		// 1. Initialize 'claim' button
		init_claim_button(task.find(".claim"));
	}
	// 4. All TASKs have content_edits
	if(task.find(".task-content") == null){
		task.find(".task-content").html('(Task Name Here)');
	}
	init_content_edits(task.find(".task-content"));
	// 5. All TASKs have remove buttons
	init_task_remove_buttons(task);
}

// Per-Task Remove Button Initializer
function init_task_remove_buttons(button_){
	add_debug('this button = ' + button_);
	if(button_ == null){
		// 1. Initialize all per-task remove buttons
		$(".task-list").each(function(){
			$(this).find(".remove-task").each(function(){
				initialize_remove_button($(this));
			});
		});
	} else {
		// 1. Initialize specified per-task remove button
		initialize_remove_button(button_.find(".remove-task"));
	}
	function initialize_remove_button(button){	
		add_debug('initializing remove button for: ' + button.parent().find(".task-content").html());
		// 1. Hide the button
		button.hide();
		// 2. Activate button
		button.click(function(){
			var task = $(this).parent();
			var task_name = $(this).find(".task-content").html();
			var section = $(this).parent().parent().attr('id');
			// 1. Check if task is shared
			if(section=='your-tasks'){
				if(task.attr('type', 'shared')){
					// 1. Find the task in #shared-tasks
					found_task = find_task('shared-tasks', task);
					found_task.toggleClass('claimed');
					var found_task = null;
					$("#shared-tasks").find(".task-bar").each(function(){
						var current_name = $(this).find(".task-content").html();
						if(current_name == task_name){
							found_task = $(this);
							// TEMPORARY... THIS SHOULD NOT REMOVE THE TASK FROM SHARED-TASKS
							found_task.hide();
							$('#shared-tasks').children('.task-list').append(create_task('task_name', 'shared-tasks', 1));
						}
					});
					// 2. Init the claim button
						//init_claim_button(found_task.find(".claim"));
					// 3. Remove the task from #your-tasks
					task.attr('delete', 'yes');
				}
			}
		});
		
	}
}

// (Shared Tasks) Claim Button Initializer
function init_claim_button(button){
	if(button==null){
		// if null, init all claim buttons in #shared-tasks
		$("#shared-tasks").find(".claim").each(function(){
			init_claim($(this));
		});
	} else{ init_claim(button); }
	
	function init_claim(button){
		button.html('claim');
		button.click(function(){
			var task = button.parent();
			var task_name = task.find(".task-content").html();
			// 1. Check if task is claimed or not
			if(task.hasClass('claimed')){
				// 1. User cannot claim a task which has already been claimed.
				add_debug('The task ' + task_name + ' is already claimed. Remove it from Your Task Queue to unclaim.</div><br />');
			} else {
				// 1. Add 'claimed' class
				task.addClass('claimed');
				$(this).html('claimed');
				// 2. Add to #your-tasks
				$("#your-tasks").find(".task-list").append(create_task(task_name, 'your-tasks', 1));
				// 3. Find the new task in #your-tasks
// UPDATE (low priority)
				var found_task = null;
				$("#your-tasks").find(".task-bar").each(function(){
					var current_name = $(this).find(".task-content").html();
					if(current_name == task_name){
						init_tasks($(this));
						return false;
					}
				});
				
			}
		});
	}
}

// initializing task name edits
function init_content_edits(content){
	if(content==null){ 
		$(".task-content").each(function(){
			init_content($(this));
		}); 
	}
	else{ init_content(content); }
	function init_content(content){
		content.click(function(){
			$(".task-content").each(function(){
				$(this).unbind('click');
			});
			var original_name = content.html();
			original_name = original_name.trim();
			content.html('<input class="input" type="text" value="' + original_name + '" />');
			content.children('.input').focus();
			content.children(".input").focusout(function(){
				content.html($(this).val());
				init_content_edits(null);
			});
		});
	}
}

// initializing checkboxes
function init_checkboxes(box){
	if(box==null){
		$(".checkbox").each(function(){
			init_checkbox($(this));
		}); 
	}
	else{ 
		init_checkbox(box);
	}
	function init_checkbox(box){
		// 1. Toggle class
		box.click(function(){
			box.toggleClass('checked');
		});
	}
}

// (HTML Generator) Task Factory
function create_task(name, location, shared){
	// TO DO: add per-task remove button to HTML
	var task;
	if(name==null){ 
		name = '(Task Name Here)';
	}
	if(location=='shared-tasks'){
		task = ('<li class="task-bar" type="shared" new="yes"><div class="remove-task" value="off"></div><button class="button claim" type="claim">claim</button><div class="task-content">' + name + '</div></li>');
	} else if(location='your-tasks'){
		if(shared){
			task = ('<li class="task-bar" type="shared" new="yes"><div class="remove-task" value="off"></div><div class="checkbox" value="0"></div><div class="task-content">' + name + '</div></li>');
		} else {
			task = ('<li class="task-bar" type="yours" new="yes"><div class="checkbox" value="0"></div><div class="task-content">' + name + '</div></li>');
		}
	}
	return task;
}

function find_task(location, task){
	/* johns
		1. Finds a task in a given LOCATION (required)
		2. Matches against a given TASK (not required)
		3. Returns found task or adds a debug message
	*/
	var found_task = null;
	var num_found = 0;
	// 1. Make sure there is a location!
	if(location == null){
		add_debug("Must provide a location when searching for a task.");
		return false;
	}
	// 2. Search for 'new' items within the location
	$("#" + location).find('[new="yes"]').each(function(){
		// 1. Check to see if a task is given
		if(task != null){
			// 1. Match against the task
			var current_name = $(this).find(".task-content").html();
			var task_name = task.find(".task-content").html();
			if(current_name == task_name){
				// 1. Found? SET!
				numfound++;
				found_task = $(this);
			}
		} else {
			// 1. Return this new item
			numfound++;
			found_task = $(this);
		}
		if(found_task != null){
			// 1. If task has been found, break out of loop
			return found_task;
		}
	});
	if(found_task != null){
		// 1. If task has been found, break out of function
		return found_task;
	}
	$("#" + location).find('.task-bar').each(function(){
		// 1. Check to see if a task is given
		if(task != null){
			// 1. Match against the task
			var current_name = $(this).find(".task-content").html();
			var task_name = task.find(".task-content").html();
			if(current_name == task_name){
				// 1. Found? SET!
				numfound++;
				found_task = $(this);
			}
		}
		if(found_task != null){
			// 1. If task has been found, break out of loop
			return found_task;
		}
	});

	// ERROR REPORT
	if(num_found > 1){
		add_debug("Warning: More than one new tasks found in " + location);
	}
	if(found_task == null){
		if(task != null){
			add_debug("Error: Task: " + task.find(".task_content").html() + "not found");
		} else {
			add_debug("Error: Task in " + location + "not found.");
		}
	}
}

function add_debug(msg){
	/*
		1. Adds the MSG into the debug div
	*/
	$("#debug").html($("#debug").html() + msg + "<br />");
}

// NOT BEING USED IN FIRST VERSIOn
function init_pref_icons(icon){
	if(icon==null){
		$(".pref-icon").each(function(){
			init_pref_icon($(this));
		}); 
	}
	else{ init_pref_icon(icon); }
	function init_pref_icon(_icon){
		var current = parseInt(_icon.attr('value'));
		_icon.html(pref_icon[current]);
		_icon.click(function(){
			var current = parseInt(_icon.attr('value'));
			if(current == 0){
				_icon.html(pref_icon[1]);
				_icon.attr('value', '1');
			} else if(current == 1){
				_icon.html(pref_icon[2]);
				_icon.attr('value', '2');
			} else if(current == 2){
				_icon.html(pref_icon[0]);
				_icon.attr('value', '0');
			}
		});
	}
}