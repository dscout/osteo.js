describe('Osteo.BoundRenderer', function() {
  it('automatically updates attributes', function() {
    var model = new Osteo.Model({ title: 'backbone' }),
        view  = new Osteo.View({ model: model }),
        template = '<div><p data-bind="title"></p></div>';

    Osteo.BoundRenderer.extend(view);

    view.$el.html(template);
    view._rendered = true;
    model.set({ title: 'osteo' });

    expect(view.$el.find('p').text()).to.eq('osteo');
  });
});
