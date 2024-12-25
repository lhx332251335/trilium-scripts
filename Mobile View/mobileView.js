// Loads the Styles -----------------------------------------------------------------------------------------------------------------------------

var styles = `
    #mobileViewWidget {
        transition: all 0.3s ease-in-out; 
        min-height: 10px;
        flex-shrink: 0;
    }

    #mobileViewInner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 5px 0; 
    }
   
    #mobileViewToggle, 
    #mobileViewSetSidebar, 
    #mobileViewSetNote, 
    #mobileViewSetRightPane {
        font-size: 100%;
        padding: 5px 0;
    }

    body:not(.mobile-view) #mobileViewSetSidebar, 
    body:not(.mobile-view) #mobileViewSetNote, 
    body:not(.mobile-view) #mobileViewSetRightPane {
        display:none !important;
    }

    /* Sidebar Mode -------------------------------------------------------*/

    body.mobile-view[current-view="sidebar"] #right-pane, 
    body.mobile-view[current-view="sidebar"] #rest-pane {
        display:none !important;
    }

    body.mobile-view[current-view="sidebar"] #left-pane {
        width:100% !important;
    }

    body.mobile-view[current-view="sidebar"] #left-pane .fancytree-node {
        height: fit-content;
        white-space: inherit;
        overflow: inherit;
    }

    /* Notes Mode ------------------------------------------------------------------*/

    body.mobile-view[current-view="note"] #right-pane, 
    body.mobile-view[current-view="note"] #left-pane {
        display:none !important;
    }

    /* Right Pane Mode ------------------------------------------------------------------*/
    body.mobile-view[current-view="right-pane"] #center-pane, 
    body.mobile-view[current-view="right-pane"] #left-pane {
        display:none !important;
    }

    body.mobile-view[current-view="right-pane"] #right-pane {
        width:100% !important;
    }
`

var styleSheet = document.createElement("style")
styleSheet.textContent = styles
document.head.appendChild(styleSheet)

// Sets the viewport for mobile device width --------------------------------------------------------------------------------------------------
var viewport = document.createElement('meta');
viewport.name = 'viewport';
viewport.content = 'width=device-width, initial-scale=1.5'
document.head.appendChild(viewport);

// Creates the widget to control the mobile view -----------------------------------------------------------------------------------------------

const template = `
<div id="mobileViewWidget" class="launcher-button component">
    <div id="mobileViewInner">
        <span id="mobileViewToggle" title="Toggle Mobile View" class="bx bx-mobile-alt" ></span>
        <span id="mobileViewSetSidebar" title="Set Sidebar View" class="bx bx-chevron-left"></span>
        <span id="mobileViewSetNote" title="Set Note View" class="bx bx-radio-circle"></span>
        <span id="mobileViewSetRightPane" title="Set Right Pane View" class="bx bx-chevron-right"></span>
    </div>
</div>
`;

class MobileView extends api.BasicWidget {
    get position() {return 1;}
    get parentWidget() {return "left-pane"}

    doRender() {
        this.$widget = $(template);
        this.$widget.find("#mobileViewToggle").on("click", this.toggleMobileView.bind(this));
        this.$widget.find("#mobileViewSetSidebar").on("click", this.setSidebarView.bind(this));
        this.$widget.find("#mobileViewSetNote").on("click", this.setNoteView.bind(this));
        this.$widget.find("#mobileViewSetRightPane").on("click", this.setRightPaneView.bind(this));
        this.adjustHeight();
        $(window).on('resize orientationchange', this.adjustHeight.bind(this)); 
        return this.$widget;
    }
    
    toggleMobileView() {
        $('body').toggleClass("mobile-view");
        this.adjustHeight();
    }
    
    setSidebarView() {
        $('body').attr("current-view", "sidebar");
        this.adjustHeight();
    }
    
    setNoteView() {
        $('body').attr("current-view", "note");
        this.adjustHeight();
    }
    
    setRightPaneView() {
        $('body').attr("current-view", "right-pane");
        this.adjustHeight();
    }
    
    adjustHeight() {
		const $inner = this.$widget.find('#mobileViewInner');
        const buttons = $inner.children();
        let totalHeight = 0;
        
        buttons.each(function() {
            totalHeight += $(this).outerHeight(true);
        });
        
        totalHeight += parseInt($inner.css('padding-top')) + parseInt($inner.css('padding-bottom'));
        
        this.$widget.css({
            'min-height': `${totalHeight}px`
        });
    }

}

module.exports = new MobileView();
