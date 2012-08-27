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
      initialize: function() {
         this.model.on("all", this.render, this);
      },

      render: function() {
         $(this.el).html(ich.nameRow(this.model.toJSON()).html());
         return this;
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

   window.nameCollection = new NameCollection();

   new AddFormView({
      "el": $("#addForm"),
       "collection": nameCollection
   });

   new NameListView({
      "el": $("#names"),
       "collection": nameCollection
   });

   $(".tooltipEnabled").tooltip();
});

