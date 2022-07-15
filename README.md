# Swing Table Layout Utility

Check out the [demo](https://etuong.github.io/swing-table-layout-utility/)

![alt text](screenshot.png)

Oracle has a layout manager called TableLayout which is an alternative for GridBagLayout for Java Swing. Essentially, to create a layout in Swing, you need to initialize the panel with appropriate and respective dimensions. This can be a major hassle especially if the layout is complex or tedious.

This simple and straightforward web-based utility helper gives the users the capability to "draw" their table and generate the strings for the TableLayout that they can copy and paste to their program. It also support cell merging and save/load via JSON. The textform on each cell is to designate a placeholder for the actual JComponent in Swing.

### How to Use
1. Insert or delete rows and columns by selecting them.
1. Fill in the initial state of each cell. This step is optional.
1. Click on the Output button to generate the Java code.
1. Copy and paste in your Java program.
1. Save and load the layout for future uses.