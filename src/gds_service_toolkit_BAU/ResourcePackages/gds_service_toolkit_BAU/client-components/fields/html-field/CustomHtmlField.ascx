<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="CustomHtmlField.ascx.cs" Inherits="SitefinityWebApp.ResourcePackages.GdsSfa.client_components.fields.html_field.CustomHtmlField" %>
<%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>
<%@ Register Assembly="Telerik.Sitefinity" Namespace="Telerik.Sitefinity.Web.UI" TagPrefix="sf" %>
<%@ Register Assembly="Telerik.Sitefinity" Namespace="Telerik.Sitefinity.Web.UI.Extenders" TagPrefix="sf" %>

<sf:ConditionalTemplateContainer ID="conditionalTemplate" runat="server">
    <Templates>
        <sf:ConditionalTemplate Left="DisplayMode" Operator="Equal" Right="Read" runat="server">
            <sf:SitefinityLabel id="titleLabel_read" runat="server" WrapperTagName="div" HideIfNoText="false" CssClass="sfTxtLbl" />
            <sf:SitefinityLabel id="viewControl" runat="server" WrapperTagName="div" HideIfNoText="false" CssClass="sfRTFContent" />
        </sf:ConditionalTemplate>
        <sf:ConditionalTemplate Left="DisplayMode" Operator="Equal" Right="Write" runat="server">
            <sf:ResourceLinks id="resourcesLinks2" runat="server" UseEmbeddedThemes="true" UseBackendTheme="True">
                <sf:EmbeddedResourcePropertySetter Name="Telerik.Sitefinity.Resources.Themes.Default.Styles.EditorDialogs.css" Static="true" ControlID="editControl" ControlPropertyName="DialogsCssFile" />
                <sf:ResourceFile Name="Styles/Window.css" />
            </sf:ResourceLinks>
            <asp:Label ID="titleLabel_write" runat="server" CssClass="sfTxtLbl" AssociatedControlID="editControl" />
            <asp:LinkButton ID="expandLink" runat="server" OnClientClick="return false;" CssClass="sfOptionalExpander" />
            <%--NewLineBr="False" - removed because of bug 112126. The bug should be fixed in the next release of RadControls.--%>
            <asp:Panel ID="expandableTarget" runat="server" CssClass="sfEditorWrp sfClearfix">
                <telerik:RadEditor 
                    ID="editControl" 
                    runat="server" 
                    Skin="Default" 
                    Width="100%" 
                    Height="550px"
                    EnableResize="False"
                    EditModes="Design,HTML" 
                    DialogHandlerUrl="~/Telerik.Web.UI.DialogHandler.axd"
                    Content=""
                    OnClientInit="onClientInit">
                    <FlashManager ViewPaths="~/Files" UploadPaths="~/Files" DeletePaths="~/Files" />
                </telerik:RadEditor>
                <sf:RadEditorCustomDialogsExtender runat="server" id="editorCustomDialogsExtender" TargetControlID="editControl"/>
                <sf:SitefinityLabel id="descriptionLabel" runat="server" WrapperTagName="div" HideIfNoText="true" CssClass="sfDescription" />
                <sf:SitefinityLabel id="exampleLabel" runat="server" WrapperTagName="div" HideIfNoText="true" CssClass="sfExample" />
            </asp:Panel>
        </sf:ConditionalTemplate>
    </Templates>        
</sf:ConditionalTemplateContainer>

<script type="text/javascript">
    Telerik.Web.UI.Editor.CommandList["InsertUnorderedListNormal"] = function (commandName, editor, args) {
        editor.fire("InsertUnorderedList");
        editor.set_html(editor.get_html().replace(/(<ul[^>]*>)/, '<ul class="list">'));
    };
    Telerik.Web.UI.Editor.CommandList["InsertUnorderedListBullet"] = function (commandName, editor, args) {
        editor.fire("InsertUnorderedList");
        editor.set_html(editor.get_html().replace(/(<ul[^>]*>)/, '<ul class="list list-bullet">'));
    };
    Telerik.Web.UI.Editor.CommandList["InsertOrderedListNumber"] = function (commandName, editor, args) {
        editor.fire("InsertOrderedList");
        editor.set_html(editor.get_html().replace(/(<ol[^>]*>)/, '<ol class="list list-number">'));
    };
    
    function onCommandExecuted(editor, args) {
        var command = args.get_commandName();

        if (command === "ApplyClass") {
            var selectedElement = editor.getSelectedElement();
            if (selectedElement.rel == 'external') {
                selectedElement.rel = '';
            }

            if (selectedElement && selectedElement.tagName == 'A') {
                if (selectedElement.className == 'external') {
                    selectedElement.className = '';
                    selectedElement.rel = 'external';
                } else if (selectedElement.className == 'normal') {
                    selectedElement.className = '';
                }
            }
        }
    }

    function onClientInit() {
        var editor = $find('<%= editControl.ClientID %>');
        editor.add_commandExecuted(onCommandExecuted);
    }

    $(document).ready(function () {
        $('span.InsertUnorderedListNormal').parent().prop('title', 'Insert Unordered List - Normal');
        $('span.InsertUnorderedListBullet').parent().prop('title', 'Insert Unordered List - Bullet');
        $('span.InsertOrderedListNumber').parent().prop('title', 'Insert Ordered List - Number');
    });
</script>

<style type="text/css">
    span.InsertUnorderedListNormal { background-position: -2286px center; }
    span.InsertUnorderedListBullet { background-position: -2286px center; }
    span.InsertOrderedListNumber { background-position: -2076px center; }
</style>