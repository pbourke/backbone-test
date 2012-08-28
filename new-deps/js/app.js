// vim: set sw=3 ts=3 expandtab:
$(document).ready(function() {
   Name = Backbone.Model.extend({});

   NameCollection = Backbone.Collection.extend({
      model:Name
   });

   AddFormView = Backbone.View.extend({
      events: {
         "click .btn": "addName"
      },

      addName: function(e) {
         e.preventDefault();
         var nameInput = this.$("#name");
         var trimmed = $.trim(nameInput.val());
         if (0 === trimmed.length) {
            return false;
         }

         this.collection.add({
            "id": trimmed
         });

         nameInput.val("");
      }
   });

   NameView = Backbone.View.extend({
      tagName : "li",

      initialize: function() {
         this.model.on("all", this.render, this);
      },

      events: {
         "click .removeName": "removeName"
      },

      render: function() {
         this.$el.html(ich.nameRow(this.model, true));
         return this;
      },

      removeName: function(evt) {
         evt.preventDefault();
         this.model.collection.remove(this.model);
         this.remove();
      }
   });

   NameListView = Backbone.View.extend({
      initialize: function() {
         this.collection.on("all", this.updateSubviews, this)
      },

      updateSubviews: function(e, nameModel) {
         if ( e === "add" ) {
            this.$el.append( new NameView({
               "model" : nameModel
            }).render().el );
         }
      }
   });

   SummaryView = Backbone.View.extend({
      initialize: function() {
         this.collection.on("all", this.render, this)
      },

      render: function(e) {
         var summary = ich.summaryView({ 
            count: this.collection.length,
            empty: this.collection.length === 0
         });
         this.$el.children().remove();
         this.$el.append(summary);
         return this;
      }
   });

   LetterSummaryView = Backbone.View.extend({
      initialize: function() {
         this.collection.on("all", this.render, this)
      },

      render: function(e) {
         ltrLst = _.map(this.collection.models.map( function(name) {
                      // list of names -> list of first letters
                      return name.id[0];
                   }).reduce( function(m, letter) {
                      // list of letters -> map of letter to count of letters
                      m[letter] = _.isUndefined(m[letter]) ? 1 : m[letter] + 1;
                      return m;
                   }, {}), function(v, k){
                      // map of letter->count to [{letter:'a', count:1}, ...]
                      return {
                        letter:k, 
                        count:v
                      };
                   });
         console.log(ltrLst);
         var summary = ich.letterSummaryView({ 
            letters: ltrLst
         }, true);
         console.log(summary);
         this.$el.children().remove();
         this.$el.append(summary);
         return this;
      }
   });

   window.nameCollection = new NameCollection();

   new AddFormView({
      "el": $("#addForm"),
       "collection": nameCollection
   });

   new NameListView({
      "el": $("#names"),
       "collection": nameCollection
   });

   new SummaryView({
      "el": $("#summaryViewContainer"),
      "collection": nameCollection
   }).render();

   new LetterSummaryView({
      "el": $("#letterSummaryViewContainer"),
      "collection": nameCollection
   }).render();

   $(".tooltipEnabled").tooltip();
});

