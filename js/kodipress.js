(function ($) {

	$(function () {

		/* Query the libraries */
		var Movies = {
			"jsonrpc": "2.0",
			"method": "VideoLibrary.GetMovies",
			"params": {
				"properties": ["title", "genre", "year", "rating", "director", "trailer", "tagline", "plot", "plotoutline", "originaltitle", "lastplayed", "playcount", "writer", "studio", "fanart", "thumbnail", "file", "dateadded", "art", "runtime"],
				"sort": {
					"order": "ascending",
					"method": "title",
					"ignorearticle": true
				}
			},
			"id": "libMovies"
		};

		// Do WordPress ajax here
		// http://stackoverflow.com/a/10360054
		var movies = $('#movies'),
			body = $('body');
		var data = {
			'action': 'kodi',
			'endpoint': encodeURIComponent(JSON.stringify(Movies))
		};

		$.post(kodipress.ajaxurl, data, function (wpResponse) {
			var obj = jQuery.parseJSON(wpResponse);
			console.log(obj);

			/**
			 * Get the full list of genres
			 */
			var moviesGenre = [];
			var moviesGenreAll = $.map(obj.result.movies, function (val, key) {
				return val.genre;
			});
			$.each(moviesGenreAll, function (i, el) {
				if ($.inArray(el, moviesGenre) === -1) moviesGenre.push(el);
			});
			$.each(moviesGenre, function (i) {
				var btn = $('<button/>')
					.text(moviesGenre[i])
					.attr({
						'type': 'button',
						'data-filter': '.' + moviesGenre[i],
						'onclick': 'this.blur();'
					})
					.addClass('btn btn-default filter')
					.appendTo($('.movies-genres'));
			});

			/*
			Compile into handlebars template
			 */
			var getTemplate = $('#movies-template').html(),
				template = Handlebars.compile(getTemplate),
				result = template(obj.result);
			movies.html(result);
			body.removeClass('loading');

			/*
			Execute jQuery plugins
			 */
			movies.mixItUp({
				selectors: {
					target: '.movie'
				},
				callbacks: {
					onMixLoad: function (state) {
						console.log('MixItUp ready!');
						$('.movies-filtersort').fadeIn();
						$('img.lazy').lazyload();
					},
					onMixStart: function (state, futureState) {
						body.addClass('loading');
						$('.search-status').html(kodipress.searching_movies);
					},
					onMixEnd: function (state) {
						body.removeClass('loading');
						/**
						 * Count the amount of movies depending on filters, genre, etc
						 */
						var count = $('.movies-list>.movie:visible').length;
						$('.search-status').html(count + ' movies found...');
					}
				},
				controls: {
					toggleFilterButtons: true,
					toggleLogic: 'and'
				}
			});
		});

		/*
		Handlebars helpers
		 */
		Handlebars.registerHelper('getImgSrc', function (thumbnail) {
			var decodeURL = decodeURIComponent(thumbnail),
				cleanURL = decodeURL.replace('image://', '');
			return new Handlebars.SafeString(cleanURL);
		});
		Handlebars.registerHelper('round', function (options) {
			return new Handlebars.SafeString(
				Math.round(options * 100) / 100
			);
		});
		Handlebars.registerHelper('formatTime', function (secs) {
			var hours = Math.floor(secs / (60 * 60));
			var divisor_for_minutes = secs % (60 * 60);
			var minutes = Math.floor(divisor_for_minutes / 60);
			return hours + ':' + minutes;
		});
		Handlebars.registerHelper('status', function (playedStatus) {
			if (playedStatus === 0) {
				return 'played-no';
			} else {
				return 'played-yes';
			}
		});

		/**
		 * Boostrap Modals
		 */
		$('#movie-details').on('show.bs.modal', function (event) {

			var modal = $(this);
			var button = $(event.relatedTarget);
			var title = button.data('title');
			var plot = button.data('plot');
			var file = button.data('file');
			var genre = button.data('genre');
			var ret = genre.split(',');
			var list = modal.find('.modal-body > .movie-genre');

			$.each(ret, function (i) {
				var span = $('<span/>')
					.text(ret[i])
					.addClass('label label-primary')
					.appendTo(list);
			});
			modal.find('.modal-title').text(title);
			modal.find('.modal-body > .movie-plot').html(plot);

			$('#movie-play').on('click', function (event) {
				event.preventDefault();
				// Play a single video from file
				var urlPlay = kodipress.ip_address + '/jsonrpc?request={"jsonrpc":"2.0","id":"1","method":"Player.Open","params":{"item":{"file":"' + file + '"}}}';
				location.href = urlPlay;
			});
		});

	});

})(jQuery);