/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	config.language = 'vi';
    config.htmlEncodeOutput = false;
    config.entities = false;
    config.entities_latin = false;
    config.fillEmptyBlocks = false;
    config.basicEntities = false;
    config.allowedContent = false;

    config.extraPlugins = 'image2';

    config.toolbar = [
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Undo', 'Redo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace' ] },
        '/',
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Strike', 'Subscript', 'Superscript' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyRight', 'JustifyCenter', 'JustifyBlock', '-', 'Blockquote', 'CreateDiv', '-' ] },
        { name: 'links', items: [ 'Link', 'Unlink' ] },
        { name: 'insert', items: [ 'Image', 'Iframe', 'Table', 'SpecialChar' ] },
        '/',
        { name: 'styles', items: [ 'Format' ] }
    ];

    // // Set the most common block elements.
    config.format_tags = 'p;h2;h3;h4;h5;h6';
};
