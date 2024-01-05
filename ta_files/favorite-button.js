"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FavoritesButton = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FavoritesButton = /*#__PURE__*/function () {
  function FavoritesButton(container) {
    _classCallCheck(this, FavoritesButton);

    this.favoritesContainer = container;
    this.toggleFavoritesUrl = this.favoritesContainer.data('toggle-url');
    this.collectionsUrl = this.favoritesContainer.data('collections-url');
    this.toggleFavoritesEnabled = this.favoritesContainer.data('toggle-favorites-enabled');
    this.addToFavoritesUrlHash = this.favoritesContainer.data('add-to-favorites-url-hash');
    this.inFavorites = this.favoritesContainer.data('in-favorites');
    this.removeFromFavoritesText = this.favoritesContainer.data('remove-from-favorites-text');
    this.addToFavoritesText = this.favoritesContainer.data('add-to-favorites-text');
    this.displayTitleAttr = this.favoritesContainer.data('display-title-attr') == 'True' ? true : false;
    this.form = this.favoritesContainer.find('.toggle-favorites-form');
    this.trigger = this.form.find('.toggle-favorites-trigger');

    if (this.inFavorites) {
      if (this.displayTitleAttr) {
        this.trigger.attr('title', this.removeFromFavoritesText);
      }

      this.trigger.attr('aria-label', this.removeFromFavoritesText);
    } else {
      if (this.displayTitleAttr) {
        this.trigger.attr('title', this.addToFavoritesText);
      }

      this.trigger.attr('aria-label', this.addToFavoritesText);
    }

    this.initToggleFavoritesCollection();
  }

  _createClass(FavoritesButton, [{
    key: "initToggleFavoritesCollection",
    value: function initToggleFavoritesCollection() {
      var _this = this;

      if (this.toggleFavoritesEnabled === false) {
        // User is not logged in
        return;
      }

      var csrftokenValue = this.form.find("[name=\"csrfmiddlewaretoken\"]").val();
      var articleTitle = this.form.find('input[name=title]').val();
      var articleAuthor = this.form.find('input[name=date]').val();
      var articleDate = this.form.find('input[name=date]').val();
      var postData = {
        'csrfmiddlewaretoken': csrftokenValue
      };

      if (articleTitle) {
        postData['title'] = articleTitle;
      }

      if (articleAuthor) {
        postData['author'] = articleAuthor;
      }

      if (articleDate) {
        postData['date'] = articleDate;
      }

      if (this.addToFavoritesUrlHash === window.location.hash) {
        postData['action'] = 'add';
        $.post(this.toggleFavoritesUrl, postData).done(function (responseJSON) {
          return _this.successHandler(responseJSON);
        }).fail(function (e) {
          return _this.failureHandler(e);
        }); // Clearing hash to prevent adding to Favorites in case of page refresh

        window.location.hash = '';
      }

      this.trigger.on('click', function (e) {
        e.preventDefault();

        if (_this.inFavorites) {
          if (_this.displayTitleAttr) {
            _this.trigger.attr('title', _this.addToFavoritesText);
          }

          _this.trigger.attr('aria-label', _this.addToFavoritesText);
        } else {
          if (_this.displayTitleAttr) {
            _this.trigger.attr('title', _this.removeFromFavoritesText);
          }

          _this.trigger.attr('aria-label', _this.removeFromFavoritesText);
        }

        postData['action'] = _this.inFavorites ? 'remove' : 'add';
        $.post(_this.toggleFavoritesUrl, postData).done(function (responseJSON) {
          return _this.successHandler(responseJSON);
        }).fail(function (e) {
          return _this.failureHandler(e);
        });
      });
    }
  }, {
    key: "successHandler",
    value: function successHandler(responseJSON) {
      this.inFavorites = responseJSON['in_favorites_collection'];
      var removeClassName = this.inFavorites ? 'favorites-button-empty' : 'favorites-button-full';
      var addClassName = this.inFavorites ? 'favorites-button-full' : 'favorites-button-empty';
      this.trigger.removeClass(removeClassName).addClass(addClassName);
      var favoritesCollectionID = responseJSON['favorites_collection_id'];
      var favoritesCollectionHtmlLink = "<a href=\"".concat(this.collectionsUrl).concat(favoritesCollectionID, "/\">") + "Click to edit your collection</a>";
      var hasChanged = responseJSON['has_changed'];
      var message = '';
      var messageLevel = 'information';
      var messageAction = 'add';

      if (hasChanged && this.inFavorites) {
        message = "Item added to Favorites. ".concat(favoritesCollectionHtmlLink, ".");
      } else if (hasChanged && !this.inFavorites) {
        message = "Item removed from Favorites. ".concat(favoritesCollectionHtmlLink, ".");
        messageAction = 'remove';
      } else if (!hasChanged && this.inFavorites) {
        messageLevel = 'warning';
        message = "Item is already in Favorites. ".concat(favoritesCollectionHtmlLink, ".");
      } else if (!hasChanged && !this.inFavorites) {
        messageLevel = 'warning';
        message = "Item is already not in Favorites. ".concat(favoritesCollectionHtmlLink, ".");
        messageAction = 'remove';
      }

      this.favoritesContainer.trigger('favorites-event', [messageLevel, messageAction, message]);
    }
  }, {
    key: "failureHandler",
    value: function failureHandler(e) {
      this.favoritesContainer.trigger('favorites-event', ['error', this.inFavorites ? 'remove' : 'add', 'Failed to modify Favorites.']);
    }
  }]);

  return FavoritesButton;
}();

exports.FavoritesButton = FavoritesButton;