var Button = ReactBootstrap.Button;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;

var scrollToNew = function() {
	$('html, body').animate({
			scrollTop: $('#createNew').offset().top
	}, 500);
};

var Recipe = React.createClass({
	getInitialState() {
		return {
			open: false
		}
	},

	toggle: function() {
		this.setState( { open: !this.state.open });
	},

	deleteRecipe: function() {
		this.props.deleteRecipe(this.props.recipe.name);
	},

	editRecipe: function() {
		this.props.editRecipe(this.props.recipe.name);
	},

	render: function () {
		var recipe = this.props.recipe;
		var id = recipe.name.replace(/\s/g, '')
		var ingredients = recipe.ingredients.map(function(a, index){
			return <li key = { index } >{ a }</li>
		})

		return (
			<div className='panel panel-default'>
				<div className='panel-heading' role='tab' id={ id + 'head'}>
					<h4 className='panel-title'>
						<a className='collapsed' role='button' data-toggle='collapse' data-parent='#mains' href={ '#' + id + 'body'} area-expanded='false' aria-controls={id + 'body'}>
							{recipe.name}
						</a>
					</h4>
				</div>
				<div id = {id + 'body'} className='panel-collapse collapse' role='tabpanel' aria-lebelledby={ id + 'head'} >
					<div className='panel-body'>
						<p>{ recipe.description }</p>
						<h4>Ingredients</h4>
							<ul>
								{ ingredients }
							</ul>
						<h4>Directions</h4>
						<p>{ recipe.directions }</p>
						<ButtonToolbar>
							<Button bsStyle = 'warning' bsSize = 'small' onClick = { this.editRecipe } >Edit</Button>
							<Button bsStyle = 'danger' bsSize = 'small' onClick = { this.deleteRecipe } >Delete</Button>
						</ButtonToolbar>
					</div>
				</div>
			</div>
		)
	}
});

var ViewAll = React.createClass({
	render: function() {
		var categorize = function(arr, str) {
			return arr.filter(function(obj) {
				return obj.category === str;
			}).sort(function(a,b){
				if (a.name < b.name) return -1;
				if (a.name > b.name) return 1;
				return 0;
			})
		}

		var deleteRecipe = this.props.deleteRecipe;
		var editRecipe = this.props.editRecipe;
		var showForm = this.props.showForm;
		var toggleForm = this.props.toggleForm;

		var makePanels = function(arr) {
			var panels = arr.map(function(obj, index) {
				return <Recipe 
							recipe = { obj } 
							key = { index } 
							showForm = { showForm } 
							toggleForm = { toggleForm } 
							deleteRecipe = { deleteRecipe } 
							editRecipe = { editRecipe } />
			})
			return panels;
		}

		var recipes = this.props.recipes;

		var mains = makePanels(categorize(recipes, 'main'));
		var apps = makePanels(categorize(recipes, 'appetizer'));
		var desserts = makePanels(categorize(recipes, 'dessert'));
		var drinks = makePanels(categorize(recipes, 'drink'));
		var others = makePanels(categorize(recipes, 'other'));

		return (
			<div>
				
				{ mains.length > 0 ? 

				<div className='panel panel-default'>
					<div className='panel-body'>
						<h3>Main Dishes</h3>
						<div className='panel-group' role='tablist' aria-multiselectable='true' id='mains'>
							{ mains }
						</div>
					</div>
				</div>

				: ''}
				{ apps.length > 0 ? 

				<div className='panel panel-default'>
					<div className='panel-body'>
						<h3>Appetizers</h3>
							<div className='panel-group' role='tablist' aria-multiselectable='true' id='apps'>
								{ apps }
							</div>
					</div>
				</div>

				: ''}
				{ desserts.length > 0 ? 

				<div className='panel panel-default'>
					<div className='panel-body'>
						<h3>Desserts</h3>
							<div className='panel-group' role='tablist' aria-multiselectable='true' id='desserts'>
								{ desserts }
							</div>
					</div>
				</div>

				: ''}
				{ drinks.length > 0 ? 

				<div className='panel panel-default'>
					<div className='panel-body'>
						<h3>Drinks</h3>
							<div className='panel-group' role='tablist' aria-multiselectable='true' id='drinks'>
								{ drinks }
							</div>
					</div>
				</div>

				: ''}
				{ others.length > 0 ? 
		
				<div className='panel panel-default'>
					<div className='panel-body'>
						<h3>Other Dishes</h3>
							<div className='panel-group' role='tablist' aria-multiselectable='true' id='others'>
								{ others }
							</div>
					</div>
				</div>

				: ''}

			</div>
		)
	}
})

var CreateForm = React.createClass({
	getInitialState() {
		return { 
			name: this.props.formInfo.name,
			category: this.props.formInfo.category,
			description: this.props.formInfo.description,
			directions: this.props.formInfo.directions,
			ingredients: this.props.formInfo.ingredients,
			addedRows: this.props.formInfo.ingredients.length - 1 || 0
		};
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			name: nextProps.formInfo.name,
			category: nextProps.formInfo.category,
			description: nextProps.formInfo.description,
			directions: nextProps.formInfo.directions,
			ingredients: nextProps.formInfo.ingredients,
			addedRows: nextProps.formInfo.ingredients.length - 1 || 0
		})
	},

	addRow: function() {
		this.setState( { addedRows: this.state.addedRows + 1 })
	},

	handleChange: function(event) {

		var ingRows = [].slice.call(document.getElementsByClassName('ingRow'));
		var ingredients = ingRows.map(function(row) {
			if ( row.value !== '' ) { return row.value; }
		})

		this.setState({ 
			name: document.getElementById('name').value || '',
			category: document.getElementById('category').value || '',
			description: document.getElementById('description').value || '',
			directions: document.getElementById('directions').value || '',
			ingredients: ingredients
		});

	},

	deleteRow: function() {
		this.setState({ addedRows: this.state.addedRows - 1 })
	},

	addRecipe: function() {
		this.props.toggleForm();
	},

	saveChanges: function(event) {

		var formInfo = {
			'name': this.state.name || "Untitled",
			'category': this.state.category,
			'description': this.state.description || null,
			'directions': this.state.directions || null,
			'ingredients': this.state.ingredients || []
			}

		this.props.addRecipe(formInfo);
	},

	render: function() {

		var rows = [];
		var num = this.state.addedRows;
	
		var i = 0;
		for (i = 0; i < num; i++) {
			var idNum = i + 1;
			var id = 'ingredients' + idNum;
			if (this.state.ingredients[idNum]) {
				var value = this.state.ingredients[idNum];
			} else {
				var value = '';
			}

			rows.push(
				<input 
					className='form-control ingRow' 
					id = { id } 
					type = 'text' 
					onChange = { this.handleChange } 
					value = { value }
					key = { i } />
			)
		}

		return (
			<div>
				<ButtonToolbar>
					<Button 
						id = 'createNew'
						bsStyle = { this.props.showForm ? 'danger' : 'primary' }
						bsSize = 'large' 
						onClick = { this.addRecipe }>
							{ this.props.showForm ? <span>Discard and Close</span> : <span>Add a Recipe</span> }
						</Button>
					<Button 
						className={ this.props.showForm ? '' : 'hidden' } 
						bsStyle = 'primary' 
						bsSize = 'large' 
						onClick={ this.saveChanges }>
							Save
						</Button>
				</ButtonToolbar>

				<div className = 'row'>
					<div className = 'col-sm-8 col-sm-offset-2'>
						<div className={ this.props.showForm ? '' : 'hidden' }>
							<h2>Recipe information<br/><small>If the name already exists, previous entry will be edited (overwritten)</small></h2>
							<div className='row'>
								<form id = 'newRecipe'>
									<div className = 'form-group'>
										<div className='col-sm-6'>

											<label htmlFor='name'>Recipe Name</label>
											<input 
												type = 'text' 
												className='form-control' 
												id = 'name' 
												onChange = { this.handleChange } 
												value = { this.state.name }/>

											<label htmlFor='category'>Category</label>
											<select className='form-control' id = 'category' onChange = { this.handleChange } value = { this.state.category }>
												<option value='main'>Main dish</option>
												<option value='appetizer'>Appetizer</option>
												<option value='dessert'>Dessert</option>
												<option value='drink'>Drink</option>
												<option value='other'>Other</option>
												</select>

											<label htmlFor='description'>Description</label>
											<textarea id = 'description' className='form-control' rows = '4'  onChange = { this.handleChange } value = { this.state.description }/>

											<label htmlFor='directions'>Directions</label>
											<textarea id = 'directions' className='form-control' rows = '4'  onChange = { this.handleChange } value = { this.state.directions }/>
										</div>
										<div className='col-sm-6'>
											
											<label htmlFor='ingredients'>Ingredients</label>
											<input type = 'text' id = 'ingredients0' className='form-control ingRow'  onChange = { this.handleChange } value = { this.state.ingredients[0] }/>
											{ rows }
											<ButtonToolbar>
												<Button 
													id = 'deleteRowButton'
													bsSize='small' 
													className='pull-right' 
													onClick = { this.deleteRow }>
													Less
												</Button>
												<Button 
													id = 'addRowButton'
													bsSize='small' 
													className='pull-right' 
													onClick = { this.addRow }>
													More
												</Button>
											</ButtonToolbar>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
})

var Page = React.createClass({
	getInitialState() {
		return {
			showForm: false,
			formInfo: {
				'name': '',
				'category': 'main',
				'description': '',
				'directions': '',
				'ingredients': ['']
				},
			recipes: this.props.recipes,
			editing: false
		}
	},

	toggleForm: function() {
		this.setState({ showForm: !this.state.showForm });
		scrollToNew();
	},

	deleteByName: function(name) {
		var recipes = this.state.recipes;
		var index = -1;
		
		recipes.forEach(function(obj) { 
			if (obj.name === name ) { 
				index = recipes.indexOf(obj)
			}
		});

		console.log(index)
		if (index !== -1) {
			recipes.splice(index, 1);
			console.log('spliced out')
		}
	},

	addRecipe: function(formInfo) {
		this.deleteByName(formInfo);
		var updatedRecipes = this.state.recipes.concat([formInfo])

		this.setState({ 
			recipes: updatedRecipes,
			formInfo: {
				'name': '',
				'category': 'main',
				'description': '',
				'directions': '',
				'ingredients': ['']
				}
		})	

		localStorage.setItem('recipes', JSON.stringify(updatedRecipes))
	},

	deleteRecipe: function(name) {
		this.deleteByName(name);

		var recipes = this.state.recipes;
		this.setState({
			recipes: recipes
		})

		localStorage.setItem('recipes', JSON.stringify(recipes))
	},

	editRecipe: function(name) {
		// opens and populates the form
		var recipes = this.state.recipes;
		var index;
		
		recipes.forEach(function(obj) { 
			if (obj.name === name ) { 
				index = recipes.indexOf(obj)
			}
		});

		var recipe = recipes[index];

		var formInfo = this.state.formInfo;
		formInfo.name = recipe.name;
		formInfo.category = recipe.category;
		formInfo.description = recipe.description;
		formInfo.directions = recipe.directions;
		formInfo.ingredients = recipe.ingredients;

		this.setState({ 
			showForm: true, 
			formInfo: formInfo,
			editing: true
		});

		scrollToNew();
	},

	render: function() {
		return (	
			<div className='container'>
				<h1>Recipe Box</h1>
				<ViewAll 
					recipes = { this.state.recipes } 
					showForm = { this.state.showForm } 
					toggleForm = { this.toggleForm } 
					deleteRecipe = { this.deleteRecipe } 
					editRecipe = { this.editRecipe } />
				<CreateForm 
					showForm = { this.state.showForm } 
					toggleForm = { this.toggleForm } 
					formInfo = { this.state.formInfo }
					editing = { this.state.editing }
					addRecipe = { this.addRecipe }/>
			</div>
		)
	}
})

var starter = [{
	'name': 'Hamburger',
	'category': 'main',
	'description': 'An all time classic.',
	'directions': 'Cook the meat, put it on a bun. Lots of options.',
	'ingredients': ['Burger meat', 'Tasty bun', 'Condiments of choice']
}];

if (localStorage.length === 0) {
	localStorage.setItem('recipes', JSON.stringify(starter))
}

var recipes = JSON.parse(localStorage.getItem('recipes'))

ReactDOM.render( < Page recipes = { recipes } / > ,
  	document.getElementById('container')
);