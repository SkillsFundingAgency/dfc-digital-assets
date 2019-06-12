<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="CustomTextField.ascx.cs" Inherits="SitefinityWebApp.ResourcePackages.GdsSfa.client_components.fields.text_field.CustomTextField" %>
<%@ Register Assembly="Telerik.Sitefinity" Namespace="Telerik.Sitefinity.Web.UI" TagPrefix="sf" %>

<sf:ConditionalTemplateContainer ID="conditionalTemplate" runat="server">
    <Templates>
        <sf:ConditionalTemplate Left="DisplayMode" Operator="Equal" Right="Read" runat="server">        
            <sf:SitefinityLabel id="titleLabel_read" runat="server" WrapperTagName="div" HideIfNoText="false" CssClass="sfTxtTitle"></sf:SitefinityLabel>
            <sf:SitefinityToolTip ID="tooltip_read" runat="server" CssClass="sfInlineBlock"></sf:SitefinityToolTip>
            <sf:SitefinityLabel id="textLabel_read" runat="server" WrapperTagName="div" HideIfNoText="false" CssClass="sfTxtContent"></sf:SitefinityLabel>
            <sf:SitefinityLabel id="descriptionLabel_read" runat="server" WrapperTagName="p" HideIfNoText="false" CssClass="sfDescription"></sf:SitefinityLabel>
            <sf:SitefinityLabel id="characterCounter_read" runat="server" WrapperTagName="div" HideIfNoText="false"/>
        </sf:ConditionalTemplate>
        <sf:ConditionalTemplate Left="DisplayMode" Operator="Equal" Right="Write" runat="server">
            <div>
                <asp:Label ID="titleLabel_write" runat="server" CssClass="sfTxtLbl sfInlineBlock" />
                <sf:SitefinityToolTip ID="tooltip_write" runat="server"></sf:SitefinityToolTip>
            </div>
            <asp:LinkButton ID="expandButton_write" runat="server" OnClientClick="return false;" CssClass="sfOptionalExpander" />
            <asp:Panel ID="expandableTarget_write" runat="server" CssClass="sfFieldWrp">
                <asp:TextBox ID="textBox_write" runat="server" CssClass="sfTxt" />
                <sf:SitefinityLabel id="characterCounter_write" runat="server" WrapperTagName="div" HideIfNoText="false" CssClass="sfFlRight sfMRight5"/>
                <sf:SitefinityLabel id="descriptionLabel_write" runat="server" WrapperTagName="div" HideIfNoText="true" CssClass="sfDescription" />
                <sf:SitefinityLabel id="exampleLabel_write" runat="server" WrapperTagName="div" HideIfNoText="true" CssClass="sfExample" />
                <sf:SitefinityLabel id="characterCounterDescription_write" runat="server" WrapperTagName="p" HideIfNoText="true" CssClass="sfExample" />
            </asp:Panel>
        </sf:ConditionalTemplate>
    </Templates>
</sf:ConditionalTemplateContainer>