describe('Window', function() {
  describe('Basic Operation', function() {
    beforeEach(function() {
      this.eventEmitter = new Mirador.EventEmitter();
      this.mockedEventEmitter = new MockEventEmitter(this.eventEmitter);
      this.appendTo = jQuery('<div/>');
      Mirador.viewer = {
        // all of this global state should be 
        // removed as soon as possible.
        eventEmitter: this.mockedEventEmitter,
        annotationEndpoints: [],
        workspace: {
          slots: []
        }
      };
      spyOn(Mirador, 'ThumbnailsView').and.callFake(function() {
        this.updateImages = jasmine.createSpy();
        this.toggle = jasmine.createSpy();
        this.adjustHeight = jasmine.createSpy();
        this.updateFocusImages = jasmine.createSpy();
      });
      spyOn(Mirador, 'ImageView').and.callFake(function() {
        this.toggle = jasmine.createSpy();
        this.adjustHeight = jasmine.createSpy();
      });
      spyOn(Mirador, 'BookView').and.callFake(function() {
        this.updateImages = jasmine.createSpy();
        this.toggle = jasmine.createSpy();
        this.adjustHeight = jasmine.createSpy();
      });
      var state = new Mirador.SaveController(jQuery.extend(true, {}, Mirador.DEFAULT_SETTINGS, {eventEmitter:this.eventEmitter}));
      this.window = new Mirador.Window(jQuery.extend(true, 
        {}, 
        state.getStateProperty('windowSettings'),
        {
          state: state,
          eventEmitter: this.eventEmitter,
          manifest: {
            jsonLd: {
              sequences: [
                { viewingHint: 'paged',
                  canvases: [{
                    '@id': ''
                  }]
              }]
            },
            getCanvases: function() { return [{
              '@id': '',
              'images':[{
              }]
            }];
            },
            getAnnotationsListUrls: function() {
              return [];
            },
            getStructures: function() {
              return [];
            },
            getVersion: function() {
              return '1';
            }
          },
          appendTo: this.appendTo
      }));
    });

    afterEach(function() {
      delete Mirador.viewer;
    });

    describe('Initialisation', function() {
      it('should place itself in DOM', function() {
        expect(true).toBe(true);
        expect(this.appendTo.find('.window')).toExist();
        expect(this.appendTo.find('.remove-object-option').css('display')).toBe('none');
        expect(this.appendTo.find('.book-option')).toExist();
        expect(this.appendTo.find('.scroll-option')).toExist();
        var calls = Mirador.ImageView.calls;
        expect(calls.count()).toBe(1);
        expect(calls.first().args[0].appendTo.is(this.appendTo.find('.view-container'))).toBe(true);
      });
    });
    describe('Menu Events', function() {
      xit('should change to book view when button is clicked', function() {
        expect(this.appendTo.find('.book-option')).toExist();
        expect(this.window.focusModules.BookView).toBe(null);
        this.appendTo.find('.book-option').trigger('click');
        var calls = Mirador.BookView.calls;
        var bottomPanelCalls = this.window.bottomPanel.updateFocusImages.calls;
        expect(calls.count()).toBe(1);
        expect(bottomPanelCalls.count()).toBe(1);
      });
    });

    describe('Destroying', function () {

      it('should respond to windowRemoved', function () {
        spyOn(this.window,'destroy');
        this.eventEmitter.publish('windowRemoved', this.window.id);
        expect(this.window.destroy).toHaveBeenCalled();
      });

      it('should unsubscribe from all events', function () {
        this.window.destroy();
        for(var key in this.window.eventEmitter.events){
          expect(this.window.eventEmitter.events[key]).toBe(0);
        }
      });

      it('should remove dom element',function(){
        this.window.destroy();
        expect(this.appendTo.find('.window').length).toBe(0);
      })

    });

  });

  describe('Configuration', function() {

  });
});
