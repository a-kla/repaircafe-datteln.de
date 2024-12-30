/// <reference types="mdast-util-directive" />
/** 
 * This file is included in mdsvex.js => can't be TS
 * 
 * Transforms`:::foo[bar]` to `<MdsvexContainer type="foo" icon="bar"`>
 * 
 * It consumes All containerDirectives!
 * 
 * requires remarkDirective v2.* to work, v3 don't work!
 * /

/**  @typedef {import('mdast').Root} MdastRoot */

import { visit } from 'unist-util-visit'

/** @type {import('unified').Plugin<[], MdastRoot>} */
const containers = () => {
	return (tree) => {
		visit(tree, (node, idx, parent) => {
			if (node.type === 'containerDirective') {
				/** :::foo[label] => `label` becomes the first child (Paragraph)
				 *      of `foo` with directiveLabel = true
				 *
				 * on cards we expect it to be the name of a icon (svg sprite)
				 * but that is handled on the MdsvexContainer component
				 */
				let label = undefined
				if (
					node.children[0].type == 'paragraph' &&
					node.children[0].data?.directiveLabel
				) {
					// console.log(node.children[0].children)
					// @ts-expect-error Fixme: tell TS it's not Typ "Break"
					label = node.children[0].children[0].value
					node.children.shift()
				}

				// console.warn(node.attributes);

				parent?.children.splice(idx || 0, 1, {
					// @ts-expect-error Fixme: tell TS it's not "TableCell"
					type: 'MdsvexContainer',
					data: {
						hName: 'MdsvexContainer',
						hProperties: {
							type: node.name,
							label: label,
							attributes:
								'{`' +
								JSON.stringify(node.attributes || '') +
								'`}'
						}
					},
					// @ts-expect-error Fixme: tell TS it's not "TableCell"
					children: node.children
				})
			}
		})
	}
}
export default containers
