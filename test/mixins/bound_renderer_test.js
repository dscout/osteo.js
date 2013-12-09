describe('Osteo.BoundRenderer', function() {
  it('automatically updates attributes', function() {
    var model = new Backbone.Model({ title: 'backbone' }),
        view  = new Backbone.View({ model: model }),
        template = '<div><p data-bind="title"></p></div>';

    Osteo.BoundRenderer.extend(view);

    view.$el.html(template);
    model.set({ title: 'osteo' });

    expect(view.$el.find('p').text()).to.eq('osteo');
  });

  it('uses attributes from a presenter', function() {
    var model    = new Backbone.Model({ title: 'backbone' }),
        view     = new Backbone.View({ model: model }),
        template = '<div><p data-bind="title"></p></div>';

    view.presenter = { title: 'OSTEO' };
    Osteo.BoundRenderer.extend(view);

    view.$el.html(template);
    model.set({ title: 'osteo' });

    expect(view.$el.find('p').text()).to.eq('OSTEO');
  });
});
