describe('Osteo.ModalView', function() {
  describe('#display', function() {
    it('jointly renders and opens the modal', function() {
      var modal = new Osteo.ModalView({});

      modal.display();

      expect($('.js-osteo-modal').length).to.eq(1);
    });

    it('re-assigns model, presenter, and collection objects', function() {
      var modal = new Osteo.ModalView({}),
          model = { id: 1 },
          pres  = { model: model },
          coll  = [model];

      modal.display({ model: model, context: pres, collection: coll });

      expect(modal.model).to.eql(model);
      expect(modal.context).to.eql(pres);
      expect(modal.collection).to.eql(coll);
    });
  });

  describe('#cancel', function() {
    it('hides the modal', function() {
      var modal = new Osteo.ModalView({});

      modal.display();
      modal.cancel();

      expect(modal.$el.hasClass('hide')).to.be.true;
    });
  });
});
