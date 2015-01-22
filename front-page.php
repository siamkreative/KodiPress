<?php get_header(); ?>

<!-- The Filters & Sort -->
<div class="row movies-filtersort">
	<div class="col-lg-6 col-md-6">
		<h4>Filter by Genre:</h4>
		<div class="btn-group" role="group" aria-label="genres" id="movies-genres">
			<button type="button" class="btn btn-default filter" data-filter="all">All</button>
		</div>
	</div>
	<div class="col-lg-6 col-md-6 text-right">
		<h4>Sort by Year / Date Added / Runtime </h4>
		<div class="btn-group" role="group">
			<button type="button" class="btn btn-default filter" data-filter=".played-yes">Only Played</button>
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
					Year
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu" role="menu">
					<li><a href="javascript:void(0);" class="sort" data-sort="year:asc">Ascending Order</a></li>
					<li><a href="javascript:void(0);" class="sort" data-sort="year:desc">Descending Order</a></li>
				</ul>
			</div>
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
					Date Added
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu" role="menu">
					<li><a href="javascript:void(0);" class="sort" data-sort="dateadded:asc">Latest First</a></li>
					<li><a href="javascript:void(0);" class="sort" data-sort="dateadded:desc">Newest First</a></li>
				</ul>
			</div>
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
					Length
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu" role="menu">
					<li><a href="javascript:void(0);" class="sort" data-sort="runtime:asc">Ascending Order</a></li>
					<li><a href="javascript:void(0);" class="sort" data-sort="runtime:desc">Descending Order</a></li>
				</ul>
			</div>
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
					Rating
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu" role="menu">
					<li><a href="javascript:void(0);" class="sort" data-sort="rating:asc">Ascending Order</a></li>
					<li><a href="javascript:void(0);" class="sort" data-sort="rating:desc">Descending Order</a></li>
				</ul>
			</div>
		</div>
	</div>
</div>

<!-- The Movies Grid -->
<div id="movies">
	<script id="movies-template" type="text/x-handlebars-template">
	<h1 class="search-status"><span>{{limits.total}}</span> movies found...</h1>
	<div class="row movies-list">
		{{#each movies}}
		<div class="movie col-lg-4 col-md-4 col-sm-6{{#each this.genre}} {{ this }}{{/each}} {{status this.playcount}}" data-year="{{this.year}}" data-dateadded="{{this.dateadded}}" data-runtime="{{this.runtime}}" data-rating="{{this.rating}}">
			<h3 class="title">{{this.label}} <span>({{this.year}})</span></h3>
			<div class="thumbnail" data-toggle="modal" data-target="#movie-details" data-title="{{this.label}}" data-plot="{{this.plot}}" data-genre="{{this.genre}}" data-file="{{this.file}}"><img class="lazy" data-original="{{getImgSrc this.thumbnail}}" width="350" height="525" alt=""></div>
			<div class="rating"><strong>Rating:</strong> {{round this.rating}}</div>
			<div class="genre"><strong>Genre:</strong> {{this.genre}}</div>
			<div class="runtime"><strong>Length:</strong> {{formatTime this.runtime}}</div>
		</div>
		{{/each}}
	</div>
	</script>
</div>

<!-- Modals -->
<div class="modal fade" id="movie-details" tabindex="-1" role="dialog" aria-labelledby="movie-detailsLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="exampleModalLabel">Movie Title</h4>
			</div>
			<div class="modal-body">
				<p class="movie-plot">Loading...</p>
				<div class="movie-genre"></div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary" id="movie-play">Play Movie</button>
			</div>
		</div>
	</div>
</div>

<?php get_footer(); ?>