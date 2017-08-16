import { Component, Input, ViewEncapsulation } from '@angular/core';
var TreeNodeDropSlot = (function () {
    function TreeNodeDropSlot() {
    }
    TreeNodeDropSlot.prototype.onDrop = function ($event) {
        this.node.mouseAction('drop', $event.event, {
            from: $event.element,
            to: { parent: this.node, index: this.dropIndex }
        });
    };
    TreeNodeDropSlot.prototype.allowDrop = function (element, $event) {
        return this.node.options.allowDrop(element, { parent: this.node, index: this.dropIndex }, $event);
    };
    TreeNodeDropSlot.decorators = [
        { type: Component, args: [{
                    selector: 'TreeNodeDropSlot, tree-node-drop-slot',
                    encapsulation: ViewEncapsulation.None,
                    styles: [
                        '.node-drop-slot { display: block; height: 2px }',
                        '.node-drop-slot.is-dragging-over { background: #ddffee; height: 20px; border: 2px dotted #888; }'
                    ],
                    template: "\n    <div\n      class=\"node-drop-slot\"\n      (treeDrop)=\"onDrop($event)\"\n      [treeAllowDrop]=\"allowDrop.bind(this)\">\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    TreeNodeDropSlot.ctorParameters = function () { return []; };
    TreeNodeDropSlot.propDecorators = {
        'node': [{ type: Input },],
        'dropIndex': [{ type: Input },],
    };
    return TreeNodeDropSlot;
}());
export { TreeNodeDropSlot };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUtbm9kZS1kcm9wLXNsb3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVcsS0FBQSxFQUFPLGlCQUFBLEVBQWtCLE1BQU8sZUFBQSxDQUFnQjtBQUlwRTtJQUFBO0lBc0NBLENBQUM7SUFsQ0MsaUNBQU0sR0FBTixVQUFPLE1BQU07UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUMxQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU87WUFDcEIsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUU7U0FDakQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG9DQUFTLEdBQVQsVUFBVSxPQUFPLEVBQUUsTUFBTTtRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEcsQ0FBQztJQUNJLDJCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDeEIsUUFBUSxFQUFFLHVDQUF1QztvQkFDakQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLE1BQU0sRUFBRTt3QkFDTixpREFBaUQ7d0JBQ2pELGtHQUFrRztxQkFDbkc7b0JBQ0QsUUFBUSxFQUFFLGtKQU1UO2lCQUNGLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCwrQkFBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNLLCtCQUFjLEdBQTJDO1FBQ2hFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzFCLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0tBQzlCLENBQUM7SUFDRix1QkFBQztDQXRDRCxBQXNDQyxJQUFBO1NBdENZLGdCQUFnQiIsImZpbGUiOiJ0cmVlLW5vZGUtZHJvcC1zbG90LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVHJlZU5vZGUgfSBmcm9tICcuLi9tb2RlbHMvdHJlZS1ub2RlLm1vZGVsJztcblxuXG5leHBvcnQgY2xhc3MgVHJlZU5vZGVEcm9wU2xvdCB7XG4gICBub2RlOiBUcmVlTm9kZTtcbiAgIGRyb3BJbmRleDogbnVtYmVyO1xuXG4gIG9uRHJvcCgkZXZlbnQpIHtcbiAgICB0aGlzLm5vZGUubW91c2VBY3Rpb24oJ2Ryb3AnLCAkZXZlbnQuZXZlbnQsIHtcbiAgICAgIGZyb206ICRldmVudC5lbGVtZW50LFxuICAgICAgdG86IHsgcGFyZW50OiB0aGlzLm5vZGUsIGluZGV4OiB0aGlzLmRyb3BJbmRleCB9XG4gICAgfSk7XG4gIH1cblxuICBhbGxvd0Ryb3AoZWxlbWVudCwgJGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZS5vcHRpb25zLmFsbG93RHJvcChlbGVtZW50LCB7IHBhcmVudDogdGhpcy5ub2RlLCBpbmRleDogdGhpcy5kcm9wSW5kZXggfSwgJGV2ZW50KTtcbiAgfVxuc3RhdGljIGRlY29yYXRvcnM6IERlY29yYXRvckludm9jYXRpb25bXSA9IFtcbnsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICBzZWxlY3RvcjogJ1RyZWVOb2RlRHJvcFNsb3QsIHRyZWUtbm9kZS1kcm9wLXNsb3QnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZXM6IFtcbiAgICAnLm5vZGUtZHJvcC1zbG90IHsgZGlzcGxheTogYmxvY2s7IGhlaWdodDogMnB4IH0nLFxuICAgICcubm9kZS1kcm9wLXNsb3QuaXMtZHJhZ2dpbmctb3ZlciB7IGJhY2tncm91bmQ6ICNkZGZmZWU7IGhlaWdodDogMjBweDsgYm9yZGVyOiAycHggZG90dGVkICM4ODg7IH0nXG4gIF0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJub2RlLWRyb3Atc2xvdFwiXG4gICAgICAodHJlZURyb3ApPVwib25Ecm9wKCRldmVudClcIlxuICAgICAgW3RyZWVBbGxvd0Ryb3BdPVwiYWxsb3dEcm9wLmJpbmQodGhpcylcIj5cbiAgICA8L2Rpdj5cbiAgYFxufSwgXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuc3RhdGljIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiAoe3R5cGU6IGFueSwgZGVjb3JhdG9ycz86IERlY29yYXRvckludm9jYXRpb25bXX18bnVsbClbXSA9ICgpID0+IFtcbl07XG5zdGF0aWMgcHJvcERlY29yYXRvcnM6IHtba2V5OiBzdHJpbmddOiBEZWNvcmF0b3JJbnZvY2F0aW9uW119ID0ge1xuJ25vZGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nZHJvcEluZGV4JzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbn1cblxuaW50ZXJmYWNlIERlY29yYXRvckludm9jYXRpb24ge1xuICB0eXBlOiBGdW5jdGlvbjtcbiAgYXJncz86IGFueVtdO1xufVxuIl19