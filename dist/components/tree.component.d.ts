import { OnChanges, Renderer, TemplateRef } from '@angular/core';
import { TreeModel } from '../models/tree.model';
import { TreeDraggedElement } from '../models/tree-dragged-element.model';
import { TreeOptions } from '../models/tree-options.model';
import { TreeViewportComponent } from './tree-viewport.component';
export declare class TreeComponent implements OnChanges {
    treeModel: TreeModel;
    treeDraggedElement: TreeDraggedElement;
    private renderer;
    _nodes: any[];
    _options: TreeOptions;
    loadingTemplate: TemplateRef<any>;
    treeNodeTemplate: TemplateRef<any>;
    treeNodeWrapperTemplate: TemplateRef<any>;
    treeNodeFullTemplate: TemplateRef<any>;
    viewportComponent: TreeViewportComponent;
    nodes: any[];
    options: TreeOptions;
    focused: boolean;
    state: any;
    toggleExpanded: any;
    activate: any;
    deactivate: any;
    focus: any;
    blur: any;
    updateData: any;
    initialized: any;
    moveNode: any;
    copyNode: any;
    loadNodeChildren: any;
    changeFilter: any;
    event: any;
    stateChange: any;
    constructor(treeModel: TreeModel, treeDraggedElement: TreeDraggedElement, renderer: Renderer);
    onKeydown($event: any): void;
    onMousedown($event: any): void;
    ngOnChanges(changes: any): void;
    sizeChanged(): void;
}
