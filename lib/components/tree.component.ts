import {
  Component, Input, Output, OnChanges, EventEmitter, Renderer,
  ViewEncapsulation, ContentChild, TemplateRef, HostListener, ViewChild
} from '@angular/core';
import { TreeModel } from '../models/tree.model';
import { TreeNode } from '../models/tree-node.model';
import { TreeDraggedElement } from '../models/tree-dragged-element.model';
import { TreeOptions } from '../models/tree-options.model';
import { TreeViewportComponent } from './tree-viewport.component';

import * as _ from 'lodash';

const { includes, pick }  = _;

@Component({
  selector: 'Tree, tree-root',
  encapsulation: ViewEncapsulation.None,
  providers: [TreeModel],
  styles: [
    '.tree-children { padding-left: 20px }',
    '.empty-tree-drop-slot .node-drop-slot { height: 20px; min-width: 100px }',
    `.tree {
      width: 100%;
      position:relative;
      display: inline-block;
      cursor: pointer;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none;   /* Chrome/Safari/Opera */
      -khtml-user-select: none;    /* Konqueror */
      -moz-user-select: none;      /* Firefox */
      -ms-user-select: none;       /* IE/Edge */
      user-select: none;           /* non-prefixed version, currently not supported by any browser */
    }`
  ],
  template: `
    <tree-viewport #viewport>
      <div
        class="tree"
        role="tree"
        tabindex="0"
        [class.outline-none]="!treeModel.isOutlineVisible()"
        [class.node-dragging]="treeDraggedElement.isDragging()">
        <tree-node-collection
          *ngIf="treeModel.roots"
          [nodes]="treeModel.roots"
          [treeModel]="treeModel"
          [templates]="{
            loadingTemplate: loadingTemplate,
            treeNodeTemplate: treeNodeTemplate,
            treeNodeWrapperTemplate: treeNodeWrapperTemplate,
            treeNodeFullTemplate: treeNodeFullTemplate
          }">
        </tree-node-collection>
        <tree-node-drop-slot
          class="empty-tree-drop-slot"
          *ngIf="treeModel.isEmptyTree()"
          [dropIndex]="0"
          [node]="treeModel.virtualRoot">
        </tree-node-drop-slot>
      </div>
    </tree-viewport>
  `
})
export class TreeComponent implements OnChanges {
  _nodes: any[];
  _options: TreeOptions;

  @ContentChild('loadingTemplate') loadingTemplate: TemplateRef<any>;
  @ContentChild('treeNodeTemplate') treeNodeTemplate: TemplateRef<any>;
  @ContentChild('treeNodeWrapperTemplate') treeNodeWrapperTemplate: TemplateRef<any>;
  @ContentChild('treeNodeFullTemplate') treeNodeFullTemplate: TemplateRef<any>;

  @ViewChild('viewport') viewportComponent: TreeViewportComponent;

  // Will be handled in ngOnChanges
  @Input() set nodes(nodes: any[]) { };
  @Input() set options(options: TreeOptions) { };

  @Input() set focused(value: boolean) {
    this.treeModel.setFocus(value);
  }

  @Input() set state(state) {
    this.treeModel.setState(state);
  }

  @Output() toggleExpanded;
  @Output() activate;
  @Output() deactivate;
  @Output() focus;
  @Output() blur;
  @Output() updateData;
  @Output() initialized;
  @Output() moveNode;
  @Output() copyNode;
  @Output() loadNodeChildren;
  @Output() changeFilter;
  @Output() event;
  @Output() stateChange;

  constructor(
    public treeModel: TreeModel,
    public treeDraggedElement: TreeDraggedElement,
    private renderer: Renderer) {

      treeModel.eventNames.forEach((name) => this[name] = new EventEmitter());
      treeModel.subscribeToState((state) => this.stateChange.emit(state));
  }

  @HostListener('keydown', ['$event'])
  onKeydown($event) {
    if (!this.treeModel.isFocused) return;
    if (includes(['input', 'textarea'],
        document.activeElement.tagName.toLowerCase())) return;

    let focusedNode = this.treeModel.getFocusedNode();

    // Home key => focus on root node.
    if ($event.key === 'Home') {
        let firstNode = this.treeModel.getFirstRoot(true);
        this.treeModel.setFocusedNode(firstNode);
        return;
    }

    // End key => focus on last visible node.
    if ($event.key === 'End') {
        let lastNode = this.treeModel.getLastRoot();

        while (lastNode.hasChildren && lastNode.isExpanded) {
            lastNode = lastNode.getLastChild(true);
        }

        this.treeModel.setFocusedNode(lastNode);
        return;
    }

    // * key => expand all nodes.
    if ($event.key === '*') {
        this.treeModel.expandAll();
        return;
    }

    this.treeModel.performKeyAction(focusedNode, $event);
  }

  @HostListener('mousedown', ['$event'])
  onMousedown($event) {
    const insideClick = this.renderer.invokeElementMethod($event.target, 'closest', ['Tree']);
    this.treeModel.setOutlineVisible(false);
    if (!insideClick) {
      this.treeModel.setFocus(false);
    }
  }

  ngOnChanges(changes) {
    this.treeModel.setData({
      options: changes.options && changes.options.currentValue,
      nodes: changes.nodes && changes.nodes.currentValue,
      events: pick(this, this.treeModel.eventNames)
    });
  }

  sizeChanged() {
    this.viewportComponent.setViewport();
  }
}
